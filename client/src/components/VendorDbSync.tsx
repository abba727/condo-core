/**
 * VendorDbSync
 *
 * Sits inside the VendorStoreProvider tree and watches for changes to the
 * vendors state. When changes are detected, it fires the appropriate
 * tRPC mutations to keep the database in sync.
 *
 * Key mappings:
 *  - vendor.archived = true  → DB status = "inactive"
 *  - vendor.archived = false → DB status = "active"
 *  - vendor.status "Active"  → DB status = "active"
 *  - vendor.status "Inactive"→ DB status = "inactive"
 */
import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

interface VendorBid {
  id: string;
  division?: string;
  scope?: string;
  amount?: number;
  status?: string;
  date?: string;
  notes?: string;
}

interface Vendor {
  id: string;
  name: string;
  trade?: string;
  role?: string;
  status?: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  archived?: boolean;
  bids?: VendorBid[];
}

interface VendorDbSyncProps {
  vendors: Vendor[];
}

function toDbStatus(vendor: Vendor): "active" | "inactive" | "pending" {
  if (vendor.archived) return "inactive";
  const s = (vendor.status ?? "").toLowerCase();
  if (s === "inactive") return "inactive";
  if (s === "pending") return "pending";
  return "active";
}

export function VendorDbSync({ vendors }: VendorDbSyncProps) {
  const addVendorMut = trpc.vendors.add.useMutation();
  const updateVendorMut = trpc.vendors.update.useMutation();
  const deleteVendorMut = trpc.vendors.delete.useMutation();
  const addBidMut = trpc.vendors.addBid.useMutation();
  const updateBidMut = trpc.vendors.updateBid.useMutation();
  const deleteBidMut = trpc.vendors.deleteBid.useMutation();

  const prevVendorsRef = useRef<Vendor[] | null>(null);
  const dbVendorIdsRef = useRef<Set<string>>(new Set());
  const dbBidIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!vendors || vendors.length === 0) return;

    // On first render, snapshot the current state as the DB baseline
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevVendorsRef.current = vendors;
      vendors.forEach((v) => {
        dbVendorIdsRef.current.add(v.id);
        (v.bids ?? []).forEach((b) => dbBidIdsRef.current.add(b.id));
      });
      return;
    }

    const prev = prevVendorsRef.current;
    if (!prev) {
      prevVendorsRef.current = vendors;
      return;
    }

    // Skip if nothing changed
    if (JSON.stringify(prev) === JSON.stringify(vendors)) return;

    const prevIds = new Set(prev.map((v) => v.id));
    const currIds = new Set(vendors.map((v) => v.id));

    // ── Detect deleted vendors ─────────────────────────────────────────────
    for (const v of prev) {
      if (!currIds.has(v.id) && dbVendorIdsRef.current.has(v.id)) {
        // Only delete if the ID is a numeric DB ID (not a temp "v-new-..." ID)
        const numId = Number(v.id);
        if (!isNaN(numId) && numId > 0) {
          deleteVendorMut.mutate({ id: numId });
        }
        dbVendorIdsRef.current.delete(v.id);
      }
    }

    // ── Detect added vendors ───────────────────────────────────────────────
    for (const v of vendors) {
      if (!prevIds.has(v.id) && !dbVendorIdsRef.current.has(v.id)) {
        addVendorMut.mutate({
          projectId: "712-driggs",
          companyName: v.name,
          contactName: v.contact,
          email: v.email,
          phone: v.phone,
          trade: v.trade,
          category: v.role,
          notes: v.notes,
          status: toDbStatus(v),
        });
        dbVendorIdsRef.current.add(v.id);
      }
    }

    // ── Detect updated vendors ─────────────────────────────────────────────
    for (const v of vendors) {
      const prevV = prev.find((p) => p.id === v.id);
      if (!prevV) continue;
      if (!dbVendorIdsRef.current.has(v.id)) continue;

      const numId = Number(v.id);
      if (isNaN(numId) || numId <= 0) continue; // Skip temp IDs

      // Check if any field changed
      const prevStatus = toDbStatus(prevV);
      const currStatus = toDbStatus(v);
      const changed =
        prevV.name !== v.name ||
        prevV.trade !== v.trade ||
        prevV.role !== v.role ||
        prevV.contact !== v.contact ||
        prevV.email !== v.email ||
        prevV.phone !== v.phone ||
        prevV.address !== v.address ||
        prevV.notes !== v.notes ||
        prevStatus !== currStatus;

      if (changed) {
        updateVendorMut.mutate({
          id: numId,
          companyName: v.name,
          contactName: v.contact,
          email: v.email,
          phone: v.phone,
          address: v.address,
          trade: v.trade,
          category: v.role,
          notes: v.notes,
          status: currStatus,
        });
      }

      // ── Detect bid changes ───────────────────────────────────────────────
      const prevBids = prevV.bids ?? [];
      const currBids = v.bids ?? [];
      const prevBidIds = new Set(prevBids.map((b) => b.id));
      const currBidIds = new Set(currBids.map((b) => b.id));

      // Deleted bids
      for (const b of prevBids) {
        if (!currBidIds.has(b.id) && dbBidIdsRef.current.has(b.id)) {
          const numBidId = Number(b.id);
          if (!isNaN(numBidId) && numBidId > 0) {
            deleteBidMut.mutate({ id: numBidId });
          }
          dbBidIdsRef.current.delete(b.id);
        }
      }

      // Added bids
      for (const b of currBids) {
        if (!prevBidIds.has(b.id) && !dbBidIdsRef.current.has(b.id)) {
          addBidMut.mutate({
            projectId: "712-driggs",
            vendorId: numId,
            division: b.division,
            scope: b.scope,
            bidAmount: b.amount,
            status: (b.status ?? "pending").toLowerCase() as
              | "pending"
              | "received"
              | "approved"
              | "rejected"
              | "contracted",
            bidDate: b.date,
            notes: b.notes,
          });
          dbBidIdsRef.current.add(b.id);
        }
      }

      // Updated bids
      for (const b of currBids) {
        const prevB = prevBids.find((p) => p.id === b.id);
        if (!prevB) continue;
        if (!dbBidIdsRef.current.has(b.id)) continue;

        const numBidId = Number(b.id);
        if (isNaN(numBidId) || numBidId <= 0) continue;

        const bidChanged =
          prevB.division !== b.division ||
          prevB.scope !== b.scope ||
          prevB.amount !== b.amount ||
          prevB.status !== b.status ||
          prevB.date !== b.date ||
          prevB.notes !== b.notes;

        if (bidChanged) {
          updateBidMut.mutate({
            id: numBidId,
            division: b.division,
            scope: b.scope,
            bidAmount: b.amount,
            status: b.status
              ? ((b.status as string).toLowerCase() as
                  | "pending"
                  | "received"
                  | "approved"
                  | "rejected"
                  | "contracted")
              : undefined,
            bidDate: b.date,
            notes: b.notes,
          });
        }
      }
    }

    prevVendorsRef.current = vendors;
  }, [vendors]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
