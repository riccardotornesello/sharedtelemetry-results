import { Competition } from "@/payload-types"
import { getPayload } from "payload"
import config from "@payload-config"

export async function getCompetitionBySlug(
  slug: string | null | undefined
): Promise<Competition | null> {
  if (!slug) {
    return null
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "competitions",
    depth: 3,
    page: 1,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0]
}

export async function getCompetitions(): Promise<Competition[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "competitions",
    depth: 3,
    page: 1,
    limit: 100,
    pagination: false,
  })

  return result.docs
}
