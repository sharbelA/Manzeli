import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PhotoManager from "@/app/admin/_components/PhotoManager";
import type { ListingImage } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Manage photos" };

export default async function ListingPhotosPage(
  props: PageProps<"/admin/listings/[id]/photos">
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("title")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const { data: images } = await supabase
    .from("listing_images")
    .select("*")
    .eq("listing_id", id)
    .order("display_order");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/admin/listings/${id}/edit`}
          className="text-sm text-warm-500 hover:text-warm-900 transition-colors"
        >
          ← Back to edit
        </Link>
      </div>

      <h1 className="mb-1 text-2xl font-semibold text-warm-900">
        Photos — {listing.title}
      </h1>
      <p className="mb-8 text-sm text-[var(--muted)]">
        Upload photos, drag to reorder. First photo becomes the cover image.
      </p>

      <PhotoManager
        listingId={id}
        initialImages={(images ?? []) as ListingImage[]}
        supabaseUrl={supabaseUrl}
      />
    </div>
  );
}
