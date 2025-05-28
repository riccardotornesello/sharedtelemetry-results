import { getCompetitions } from "@/features/competitions/queries";

export const metadata = {
  title: "SharedTelemetry Results",
};

export default async function HomePage() {
  const competitions = await getCompetitions();

  return (
    <main>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="tracking-light text-[32px] font-bold leading-tight min-w-72">
                Welcome to SharedTelemetry Results,
              </p>
            </div>

            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              SharedTelemetry Results is a real-time results tracker for
              simracing events.
            </p>
            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              Stay up-to-date with the latest race results, driver standings,
              and team performance.
            </p>

            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Featured Events
            </h2>

            {competitions.map((competition) => (
              <div key={competition.id} className="p-4">
                <div className="flex items-stretch justify-between gap-4 rounded-lg">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-bold leading-tight">
                        {competition.name}
                      </p>
                    </div>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse text-sm font-medium leading-normal w-fit">
                      <span className="truncate">View Event</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
