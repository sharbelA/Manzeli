import type { Metadata } from "next";
import Link from "next/link";
import { getHosts } from "@/lib/supabase/queries/admin";
import ListingForm from "@/app/admin/_components/ListingForm";

export const metadata: Metadata = { title: "New chalet" };

export default async function NewListingPage() {
  const hosts = await getHosts();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/listings"
          className="text-sm text-warm-500 hover:text-warm-900 transition-colors"
        >
          ← All chalets
        </Link>
      </div>

      <h1 className="mb-8 text-2xl font-semibold text-warm-900">New chalet</h1>

      <ListingForm mode="create" hosts={hosts} />
    </div>
  );
}
