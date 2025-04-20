import { Competition } from "./types";
import { db } from "@/lib/firebase";

export async function getCompetitionBySlug(
  slug: string | null | undefined
): Promise<Competition | null> {
  if (!slug) {
    return null;
  }

  const competitionRef = db
    .collection("results_competitions")
    .where("slug", "==", slug);
  const competitionSnapshot = await competitionRef.get();

  if (competitionSnapshot.empty) {
    return null;
  }

  const competitionData = competitionSnapshot.docs[0].data();
  const competition = {
    id: competitionSnapshot.docs[0].id,
    ...competitionData,
  };
  return competition as Competition;
}
