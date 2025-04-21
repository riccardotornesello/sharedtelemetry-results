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
  );
}
