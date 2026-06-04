/**
 * useVendorsDb
 * Provides database-backed vendors, bids, COIs, and audit log via tRPC.
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
  const archiveMut = trpc.vendors.archive.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const restoreMut = trpc.vendors.restore.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const updateRatingMut = trpc.vendors.updateRating.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const addDocumentAuditMut = trpc.vendors.addDocumentAudit.useMutation();

  const addBidMut = trpc.vendors.addBid.useMutation({
    onSuccess: () => utils.vendors.listBids.invalidate(),
  });
  const updateBidMut = trpc.vendors.updateBid.useMutation({
    onSuccess: () => utils.vendors.listBids.invalidate(),
  });
  const deleteBidMut = trpc.vendors.deleteBid.useMutation({
    onSuccess: () => utils.vendors.listBids.invalidate(),
  });

  const addCoiMut = trpc.vendors.addCoi.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const updateCoiMut = trpc.vendors.updateCoi.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
  });
  const deleteCoiMut = trpc.vendors.deleteCoi.useMutation({
    onSuccess: () => utils.vendors.list.invalidate(),
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
      rating: v.rating ?? 0,
      contracts: vendorBids.filter((b) => b.status === "Contracted").length,
      paid: Number(v.paid ?? 0),
      contractValue: totalContractValue || Number(v.contractValue ?? 0),
      contact: v.contactName ?? "—",
      email: v.email ?? "",
      phone: v.phone ?? "",
      address: v.address ?? "",
      ein: v.ein ?? "",
      notes: v.notes ?? "",
      coiExpires: v.coiExpires ?? "Not tracked",
      coiOk: v.coiOk ?? true,
      init: vendorInitials(v.companyName),
      color: v.id % 7,
      rawSources: [],
      projectIds: [PROJECT_ID],
      bids: vendorBids,
      cois: [],
      auditLog: [],
      archived: v.archived ?? false,
      archivedAt: v.archivedAt instanceof Date ? v.archivedAt.toISOString() : (v.archivedAt ? String(v.archivedAt) : null),
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
        ein: data.ein as string | undefined,
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
        ein: patch.ein as string | undefined,
        status:
          patch.status === "Active"
            ? "active"
            : patch.status === "Inactive"
            ? "inactive"
            : patch.status === "Pending"
            ? "pending"
            : undefined,
        rating: patch.rating as number | undefined,
        paid: patch.paid as number | undefined,
        contractValue: patch.contractValue as number | undefined,
        coiExpires: patch.coiExpires as string | undefined,
        coiOk: patch.coiOk as boolean | undefined,
      });
    },
    [updateVendorMut]
  );

  const updateRating = useCallback(
    (vendorId: string, rating: number) => {
      updateRatingMut.mutate({ id: Number(vendorId), rating });
    },
    [updateRatingMut]
  );

  const archiveVendor = useCallback(
    (vendorId: string) => {
      archiveMut.mutate({ id: Number(vendorId) });
    },
    [archiveMut]
  );

  const restoreVendor = useCallback(
    (vendorId: string) => {
      restoreMut.mutate({ id: Number(vendorId) });
    },
    [restoreMut]
  );

  const addDocumentAudit = useCallback(
    (vendorId: string, fileName: string) => {
      addDocumentAuditMut.mutate({ id: Number(vendorId), fileName });
    },
    [addDocumentAuditMut]
  );

  const addVendorTransaction = useCallback(
    (_vendorId: string, _txn: Record<string, unknown>) => {
      // Vendor transactions are tracked via the expenses module
      // No separate vendor_transactions table — this is a no-op for now
    },
    []
  );

  const toggleProjectAssignment = useCallback(
    (_vendorId: string) => {
      // All vendors are assigned to the project in the DB model
      // This is a no-op in the DB-backed model
    },
    []
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
        projectId: PROJECT_ID,
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
      deleteBidMut.mutate({ id: Number(bidId), projectId: PROJECT_ID });
    },
    [deleteBidMut]
  );

  const addCoi = useCallback(
    (vendorId: string, coi: Record<string, unknown>) => {
      addCoiMut.mutate({
        vendorId: Number(vendorId),
        type: coi.type as string | undefined,
        carrier: coi.carrier as string | undefined,
        policyNumber: coi.policyNumber as string | undefined,
        expires: coi.expires as string | undefined,
        status: (coi.status as string | undefined) as "active" | "expired" | "expiring_soon" | undefined,
        notes: coi.notes as string | undefined,
      });
    },
    [addCoiMut]
  );

  const updateCoi = useCallback(
    (vendorId: string, coiId: string, patch: Record<string, unknown>) => {
      updateCoiMut.mutate({
        id: Number(coiId),
        vendorId: Number(vendorId),
        type: patch.type as string | undefined,
        carrier: patch.carrier as string | undefined,
        policyNumber: patch.policyNumber as string | undefined,
        expires: patch.expires as string | undefined,
        status: patch.status as "active" | "expired" | "expiring_soon" | undefined,
        notes: patch.notes as string | undefined,
      });
    },
    [updateCoiMut]
  );

  const deleteCoi = useCallback(
    (vendorId: string, coiId: string) => {
      deleteCoiMut.mutate({ id: Number(coiId), vendorId: Number(vendorId) });
    },
    [deleteCoiMut]
  );

  return {
    vendors,
    projectVendorIds,
    isLoading: vendorsQuery.isLoading,
    addVendor,
    updateVendor,
    updateRating,
    addVendorTransaction,
    toggleProjectAssignment,
    addBid,
    updateBid,
    deleteBid,
    addCoi,
    updateCoi,
    deleteCoi,
    archiveVendor,
    restoreVendor,
    addDocumentAudit,
  };
}
