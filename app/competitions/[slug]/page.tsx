"use server";

import { RankingTable } from "@/features/ranking/components/ranking-table";
import { getCompetitionRanking } from "@/features/ranking/utils";

export default async function CompetitionResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const competition = await getCompetitionRanking((await params).slug);

  return (
    <RankingTable
      ranking={competition?.driversRanking}
      competition={competition?.competition}
    />
  );
}
