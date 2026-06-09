import { createClient } from '@/lib/supabase/server'
import type { Review } from '@/lib/supabase/types'

export async function getApprovedReviews(listingId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (data ?? []) as Review[]
}

export async function getGuestReview(
  listingId: string,
  guestId: string,
): Promise<Review | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .eq('guest_id', guestId)
    .maybeSingle()

  return (data as Review | null)
}

export type AdminReview = Review & {
  listings: { title: string; slug: string }
}

export async function getAllReviewsForAdmin(status?: string): Promise<AdminReview[]> {
  const supabase = await createClient()
  let query = supabase
    .from('reviews')
    .select('*, listings(title, slug)')
    .order('created_at', { ascending: false })

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    query = query.eq('status', status)
  }

  const { data } = await query
  return (data ?? []) as AdminReview[]
}
