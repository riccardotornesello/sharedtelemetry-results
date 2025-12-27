/**
 * Footer component displays site attribution and links.
 *
 * This component is typically placed at the bottom of pages and includes:
 * - Attribution to the project creator
 * - Link to the GitHub repository
 */
export function Footer() {
  return (
    <footer className="w-full p-5 text-center font-bold text-gray-200">
      <div className="mb-4">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/riccardotornesello"
            target="_blank"
            rel="noopener"
          >
            Riccardo Tornesello
          </a>
        </p>
      </div>

      <div>
        <a href="https://github.com/riccardotornesello/sharetelemetry-results">
          GitHub Repository
        </a>
      </div>
    </footer>
  )
}
