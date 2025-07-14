"use server"

import type { Metadata } from "next"
import { RankingTable } from "@/features/ranking/components/ranking-table"
import { getCompetitionRanking } from "@/features/ranking/utils"
import { getCompetitionBySlug } from "@/features/competitions/queries"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug

  const competition = await getCompetitionBySlug(slug)

  return {
    title: competition?.name
      ? `${competition.name} | SharedTelemetry Results`
      : "SharedTelemetry Results",
  }
}

export default async function CompetitionResultsPage({ params }: Props) {
  const slug = (await params).slug
  const competitionRanking = await getCompetitionRanking(slug)

  if (!competitionRanking) {
    return <div>No ranking available</div>
  }

  return (
    <main>
      <h1 className="w-full p-5 text-center text-2xl font-bold text-gray-200">
        {competitionRanking.competition.name}
      </h1>

      <div className="w-full overflow-x-auto">
        <RankingTable
          ranking={competitionRanking.driversRanking}
          competition={competitionRanking.competition}
        />
      </div>
    </main>
  )
}
