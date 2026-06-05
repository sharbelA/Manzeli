/**
 * Listing queries.
 * Server-side data fetching with automatic mock-data fallback
 * when Supabase isn't configured yet.
 *
 * Usage:
 *   import { getListings, getListingBySlug, getListingFull } from "@/lib/supabase/queries/listings";
 *   const featured = await getListings({ featured: true });
 *   const full = await getListingFull("seafront-stone-villa-batroun");
 */

import { Listing } from "@/lib/types";
import { mockListings } from "@/lib/mock-data";
import type {
  Listing as DbListing,
  ListingImage,
  ListingRoom,
  Availability,
  Profile,
} from "@/lib/supabase/types";

export type ListingPageData = {
  listing: DbListing;
  images: ListingImage[];
  rooms: ListingRoom[];
  availability: Availability[];
  host: Profile | null;
};

// ─── Helpers ────────────────────────────────────────────────

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getSupabase() {
  const { createServerClient } = await import("@/lib/supabase/server");
  return createServerClient();
}

// ─── Queries ────────────────────────────────────────────────

interface GetListingsOptions {
  featured?: boolean;
  region?: string;
  limit?: number;
}

export async function getListings(
  options: GetListingsOptions = {}
): Promise<Listing[]> {
  const { featured, region, limit } = options;

  // Use mock data when Supabase isn't configured
  if (!isSupabaseConfigured) {
    let results = [...mockListings];
    if (featured) results = results.filter((l) => l.is_featured);
    if (region) results = results.filter((l) => l.region === region);
    if (limit) results = results.slice(0, limit);
    return results;
  }

  const supabase = await getSupabase();
  let query = supabase.from("listings").select("*");

  if (featured) query = query.eq("is_featured", true);
  if (region) query = query.eq("region", region);
  if (limit) query = query.limit(limit);

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("[getListings]", error.message);
    return [];
  }

  return (data as Listing[]) ?? [];
}

export async function getListingBySlug(
  slug: string
): Promise<Listing | null> {
  if (!isSupabaseConfigured) {
    return mockListings.find((l) => l.slug === slug) ?? null;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[getListingBySlug]", error.message);
    return null;
  }

  return data as Listing;
}

export async function getListingFull(
  slug: string
): Promise<ListingPageData | null> {
  if (!isSupabaseConfigured) {
    return getMockListingFull(slug);
  }

  const supabase = await getSupabase();

  const { data: listing, error: listingErr } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (listingErr || !listing) return null;

  const from = new Date();
  from.setDate(1);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 3);

  const [imagesRes, roomsRes, availRes, hostRes] = await Promise.all([
    supabase
      .from("listing_images")
      .select("*")
      .eq("listing_id", listing.id)
      .order("display_order"),
    supabase
      .from("listing_rooms")
      .select("*")
      .eq("listing_id", listing.id),
    supabase
      .from("availability")
      .select("*")
      .eq("listing_id", listing.id)
      .gte("date", from.toISOString().slice(0, 10))
      .lte("date", to.toISOString().slice(0, 10)),
    supabase
      .from("profiles")
      .select("*")
      .eq("id", listing.host_id)
      .single(),
  ]);

  return {
    listing: listing as DbListing,
    images: (imagesRes.data ?? []) as ListingImage[],
    rooms: (roomsRes.data ?? []) as ListingRoom[],
    availability: (availRes.data ?? []) as Availability[],
    host: (hostRes.data ?? null) as Profile | null,
  };
}

// ─── Mock fallback ───────────────────────────────────────────

const MOCK_SLUGS: Record<string, ListingPageData> = {
  "seafront-stone-villa-batroun": {
    listing: {
      id: "1",
      host_id: "host-1",
      title: "Seafront Stone Villa with Pool",
      slug: "seafront-stone-villa-batroun",
      description:
        "Wake up to the sound of the Mediterranean in this beautifully restored traditional Lebanese stone villa. Perched just metres from the shore in Batroun's quietest cove, the house blends century-old architecture with every modern comfort. A large private pool sits at the centre of the terrace — surrounded by jasmine and bougainvillea — offering shaded lounging by day and candlelit dinners under the stars by night.\n\nInside, four bedrooms each open onto a private balcony. The open-plan living area has high arched ceilings, original stone floors and wide picture windows framing the sea. Fully equipped kitchen, outdoor BBQ station, and fast Wi-Fi throughout.",
      location: "Batroun",
      price: 280,
      bedrooms: 4,
      bathrooms: 3,
      max_guests: 8,
      pet_friendly: true,
      pool: true,
      wifi: true,
      parking: true,
      ac: true,
      bbq: true,
      sea_view: true,
      mountain_view: false,
      latitude: 34.2554,
      longitude: 35.6581,
      house_rules: [
        "No smoking indoors",
        "Quiet hours after 11 pm",
        "Pets welcome — please clean up after them",
        "No parties or events without prior approval",
        "Check-in from 3 pm, check-out by 11 am",
      ],
      is_featured: true,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    images: [
      {
        id: "img-1",
        listing_id: "1",
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
        display_order: 1,
        alt_text: "Villa exterior with pool",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "img-2",
        listing_id: "1",
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        display_order: 2,
        alt_text: "Private pool terrace",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "img-3",
        listing_id: "1",
        url: "https://images.unsplash.com/photo-1602343168117-bb8ced3b3b0e?w=800&q=80",
        display_order: 3,
        alt_text: "Living room with sea view",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "img-4",
        listing_id: "1",
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
        display_order: 4,
        alt_text: "Master bedroom balcony",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "img-5",
        listing_id: "1",
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        display_order: 5,
        alt_text: "Kitchen and dining area",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    rooms: [
      {
        id: "room-1",
        listing_id: "1",
        name: "Master Suite",
        beds: 1,
        view_description: "Sea view, private balcony",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "room-2",
        listing_id: "1",
        name: "Guest Room 1",
        beds: 2,
        view_description: "Garden and pool view",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "room-3",
        listing_id: "1",
        name: "Guest Room 2",
        beds: 2,
        view_description: "Mountain view",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "room-4",
        listing_id: "1",
        name: "Studio Loft",
        beds: 1,
        view_description: "Sea view, mezzanine",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    availability: [],
    host: {
      id: "host-1",
      name: "Georges Khoury",
      phone: "+961 3 123 456",
      whatsapp: "+96131234567",
      role: "host",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
};

function getMockListingFull(slug: string): ListingPageData | null {
  if (MOCK_SLUGS[slug]) return MOCK_SLUGS[slug];
  // Generic fallback for any slug found in mockListings
  const base = mockListings.find((l) => l.slug === slug);
  if (!base) return null;
  return {
    listing: {
      id: base.id,
      host_id: "host-1",
      title: base.title,
      slug: base.slug,
      description: `A beautiful chalet in ${base.location}. Enjoy the best of Lebanese hospitality in this carefully curated property with stunning views and modern amenities.`,
      location: base.location,
      price: base.price_per_night,
      bedrooms: base.bedrooms,
      bathrooms: base.bathrooms,
      max_guests: base.max_guests,
      pet_friendly: base.amenities.some((a) =>
        a.toLowerCase().includes("pet")
      ),
      pool: base.amenities.some((a) => a.toLowerCase().includes("pool")),
      wifi: base.amenities.some((a) => a.toLowerCase().includes("wifi")),
      parking: base.amenities.some((a) =>
        a.toLowerCase().includes("parking")
      ),
      ac: base.amenities.some((a) => a.toLowerCase().includes("ac")),
      bbq: base.amenities.some((a) => a.toLowerCase().includes("bbq")),
      sea_view: base.amenities.some((a) =>
        a.toLowerCase().includes("sea")
      ),
      mountain_view: base.amenities.some((a) =>
        a.toLowerCase().includes("mountain")
      ),
      latitude: 34.2554,
      longitude: 35.6581,
      house_rules: [
        "No smoking indoors",
        "Quiet hours after 11 pm",
        "Check-in from 3 pm, check-out by 11 am",
      ],
      is_featured: base.is_featured,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    images: [
      {
        id: "img-1",
        listing_id: base.id,
        url: base.cover_image,
        display_order: 1,
        alt_text: base.title,
        created_at: "2024-01-01T00:00:00Z",
      },
      ...base.images.map((url, i) => ({
        id: `img-${i + 2}`,
        listing_id: base.id,
        url,
        display_order: i + 2,
        alt_text: base.title,
        created_at: "2024-01-01T00:00:00Z",
      })),
    ],
    rooms: [
      {
        id: "room-1",
        listing_id: base.id,
        name: "Bedroom 1",
        beds: 1,
        view_description: null,
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    availability: [],
    host: {
      id: "host-1",
      name: base.host_name,
      phone: null,
      whatsapp: null,
      role: "host",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  };
}
