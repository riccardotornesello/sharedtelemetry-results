"use server";

import { RankingTable } from "@/features/ranking/components/ranking-table";
import { getCompetitionRanking } from "@/features/ranking/utils";

export default async function CompetitionResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const competitionRanking = await getCompetitionRanking((await params).slug);

  if (!competitionRanking) {
    return <div>No ranking available</div>;
  }

  return (
    <RankingTable
      ranking={competitionRanking.driversRanking}
      competition={competitionRanking.competition}
    />
  );
}
