/**
 * useVendorsDb
 * Provides database-backed vendors and bids via tRPC.
 * Designed to be a drop-in data source for VendorStoreProvider.
 */
import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

const PROJECT_ID = "712-driggs";

function vendorInitials(name: string): string {
  return String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "?";
}

export function useVendorsDb() {
  const utils = trpc.useUtils();

  const vendorsQuery = trpc.vendors.list.useQuery({ projectId: PROJECT_ID });
  const bidsQuery = trpc.vendors.listBids.useQuery({ projectId: PROJECT_ID });

  const addVendorMut = trpc.vendors.add.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const updateVendorMut = trpc.vendors.update.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const deleteVendorMut = trpc.vendors.delete.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });

  const addBidMut = trpc.vendors.addBid.useMutation({
    onSuccess: () => utils.vendors.listBids.invalidate(),
  });
  const updateBidMut = trpc.vendors.updateBid.useMutation({
    onSuccess: () => utils.vendors.listBids.invalidate(),
  });
  const deleteBidMut = trpc.vendors.deleteBid.useMutation({
    onSuccess: () => utils.vendors.listBids.invalidate(),
  });

  const rawVendors = vendorsQuery.data ?? [];
  const rawBids = bidsQuery.data ?? [];

  // Map DB rows to the shape expected by VendorStoreProvider
  const vendors = rawVendors.map((v) => {
    const vendorBids = rawBids
      .filter((b) => b.vendorId === v.id)
      .map((b) => ({
        id: String(b.id),
        division: b.division ?? "",
        scope: b.scope ?? "",
        amount: Number(b.bidAmount ?? 0),
        status: b.status
          ? b.status.charAt(0).toUpperCase() + b.status.slice(1)
          : "Pending",
        date: b.bidDate ?? "",
        notes: b.notes ?? "",
      }));

    const totalContractValue = vendorBids
      .filter((b) => b.status === "Contracted" || b.status === "Approved")
      .reduce((s, b) => s + b.amount, 0);

    return {
      id: String(v.id),
      name: v.companyName,
      role: v.category ?? "Project contact",
      trade: v.trade ?? "Consulting",
      status: v.status === "active" ? "Active" : v.status === "inactive" ? "Inactive" : "Pending",
      rating: 0,
      contracts: vendorBids.filter((b) => b.status === "Contracted").length,
      paid: 0,
      contractValue: totalContractValue,
      contact: v.contactName ?? "—",
      email: v.email ?? "",
      phone: v.phone ?? "",
      address: v.address ?? "",
      ein: "",
      notes: v.notes ?? "",
      coiExpires: "Not tracked",
      coiOk: true,
      init: vendorInitials(v.companyName),
      color: v.id % 7,
      rawSources: [],
      projectIds: [PROJECT_ID],
      bids: vendorBids,
      cois: [],
      auditLog: [],
      archived: v.status === "inactive",
      archivedAt: v.status === "inactive" ? (v.updatedAt instanceof Date ? v.updatedAt.toISOString() : String(v.updatedAt ?? "")) : null,
    };
  });

  // All vendors are project-assigned (seeded with project ID)
  const projectVendorIds = new Set(vendors.map((v) => v.id));

  // ─── Actions ──────────────────────────────────────────────────────────────
  const addVendor = useCallback(
    (data: Record<string, unknown>) => {
      addVendorMut.mutate({
        projectId: PROJECT_ID,
        companyName: String(data.name ?? "New Vendor"),
        contactName: data.contact as string | undefined,
        email: data.email as string | undefined,
        phone: data.phone as string | undefined,
        trade: data.trade as string | undefined,
        category: data.role as string | undefined,
        notes: data.notes as string | undefined,
      });
    },
    [addVendorMut]
  );

  const updateVendor = useCallback(
    (id: string, patch: Record<string, unknown>) => {
      updateVendorMut.mutate({
        id: Number(id),
        companyName: patch.name as string | undefined,
        contactName: patch.contact as string | undefined,
        email: patch.email as string | undefined,
        phone: patch.phone as string | undefined,
        trade: patch.trade as string | undefined,
        category: patch.role as string | undefined,
        notes: patch.notes as string | undefined,
        status:
          patch.status === "Active"
            ? "active"
            : patch.status === "Inactive"
            ? "inactive"
            : undefined,
      });
    },
    [updateVendorMut]
  );

  const addBid = useCallback(
    (vendorId: string, bid: Record<string, unknown>) => {
      addBidMut.mutate({
        projectId: PROJECT_ID,
        vendorId: Number(vendorId),
        division: bid.division as string | undefined,
        scope: bid.scope as string | undefined,
        bidAmount: bid.amount as number | undefined,
        status: (bid.status as string ?? "pending").toLowerCase() as
          | "pending"
          | "received"
          | "approved"
          | "rejected"
          | "contracted",
        bidDate: bid.date as string | undefined,
        notes: bid.notes as string | undefined,
      });
    },
    [addBidMut]
  );

  const updateBid = useCallback(
    (_vendorId: string, bidId: string, patch: Record<string, unknown>) => {
      updateBidMut.mutate({
        id: Number(bidId),
        division: patch.division as string | undefined,
        scope: patch.scope as string | undefined,
        bidAmount: patch.amount as number | undefined,
        status: patch.status
          ? ((patch.status as string).toLowerCase() as
              | "pending"
              | "received"
              | "approved"
              | "rejected"
              | "contracted")
          : undefined,
        bidDate: patch.date as string | undefined,
        notes: patch.notes as string | undefined,
      });
    },
    [updateBidMut]
  );

  const deleteBid = useCallback(
    (_vendorId: string, bidId: string) => {
      deleteBidMut.mutate({ id: Number(bidId) });
    },
    [deleteBidMut]
  );

  return {
    vendors,
    projectVendorIds,
    isLoading: vendorsQuery.isLoading,
    addVendor,
    updateVendor,
    addBid,
    updateBid,
    deleteBid,
  };
}
