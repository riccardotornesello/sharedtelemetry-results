export const metadata = {
  title: "ShareTelemetry Results",
}

export default async function HomePage() {
  return (
    <main>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="tracking-light text-[32px] font-bold leading-tight min-w-72">
                Welcome to ShareTelemetry Results
              </p>
            </div>

            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              ShareTelemetry Results is a real-time results tracker for
              simracing events.
            </p>
            <p className="text-base font-normal leading-normal pb-3 pt-1 px-4">
              Stay up-to-date with the latest race results, driver standings,
              and team performance.
            </p>

            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Special thanks to:
            </h2>
            <div className="px-4 pb-3 pt-1">
              <a
                href="https://www.simracingleague.it"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.simracingleague.it/wp-content/uploads/SRL-LOGO-4.svg"
                  alt="SimRacingLeague Logo"
                  className="h-8 mb-4"
                />
              </a>
              <p className="text-base font-normal leading-normal pb-3 pt-1">
                SimRacingLeague.it for believing in the project and supporting
                its development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
