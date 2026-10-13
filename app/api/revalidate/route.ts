import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

/*
 * Called by a Sanity webhook on every publish, unpublish or delete. The body
 * carries the document's `_type`, which is the tag every query reading that
 * type is cached under (sanity/lib/data.ts), so marking it stale refreshes
 * exactly the pages that show it.
 *
 * Webhook (sanity.io/manage → API → Webhooks):
 *   URL        https://<domain>/api/revalidate
 *   Trigger    create, update, delete
 *   Projection {_type}
 *   Secret     the same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return new NextResponse("SANITY_REVALIDATE_SECRET is not set", {
      status: 500,
    })
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    secret
  )
  if (!isValidSignature) {
    return new NextResponse("Invalid signature", { status: 401 })
  }
  if (!body?._type) {
    return new NextResponse("No _type in the body", { status: 400 })
  }

  revalidateTag(body._type, "max")
  return NextResponse.json({ revalidated: body._type, now: Date.now() })
}
