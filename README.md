# ShareTelemetry Results

<img src="doc/logo.png" width="300" alt="Share Telemetry logo" />

[![Production Site](https://img.shields.io/badge/live-site-green?style=flat-square)](https://results.sharetelemetry.com)

**ShareTelemetry Results** is a real-time race results platform built with [Next.js](https://nextjs.org/) and powered by the [Payload CMS](https://payloadcms.com/), designed to handle multi-session qualifications and deliver live data updates during competitive sim racing events.

> 🌐 Live site: [results.sharetelemetry.com](https://results.sharetelemetry.com)

## 🏗️ Architecture overview

The platform combines a modern web frontend, a headless CMS, and a MongoDB-based data pipeline to deliver real-time and structured information.

### 🔹 Frontend

- Built with **Next.js** (React + TypeScript)
- Deployed on **[Vercel](https://vercel.com/)** for fast and scalable production hosting
- Connects directly to MongoDB to read processed competition results
- Displays real-time rankings and lap times based on processed data

### 🔹 CMS (Content Management System)

- Powered by **Payload CMS**
- Stores structured data about:
  - Competitions metadata (league ID, season ID, event groups)
  - Teams and drivers information
  - Competition configuration (classes, time windows)
- Connected to a **PostgreSQL** database for persistent data storage

### 🔹 Data Pipeline (iRacing Integration)

The data flows through a multi-stage pipeline:

1. **Data Collection** - The scraper collects raw session and lap data from iRacing:
   - Companion project: [sharetelemetry-iracing-scraper](https://github.com/riccardotornesello/sharetelemetry-iracing-scraper)
   - Saves raw data to a **MongoDB** database (`iracing-scraper` database)

2. **Data Processing** - An operator periodically processes the raw data:
   - Reads from the raw MongoDB database
   - Calculates best lap times, validates sessions, aggregates results
   - Saves processed results to another **MongoDB** database (`results-operator` database)

3. **Data Display** - The frontend reads and displays results:
   - Connects to the processed MongoDB database
   - Fetches competition results based on competition slug
   - Renders rankings, lap times, and driver performance

## ⚙️ Features

- Real-time results for multi-session qualifications
- Visual breakdown of each session and driver performance
- Structured event management through Payload CMS
- Seamless combination of static competition data and live updates
- Currently integrated with **iRacing**
- Actively used by [simracingleague.it](https://simracingleague.it) for national championship qualifications

## 📦 Tech Stack

| Layer           | Tech                                          |
| --------------- | --------------------------------------------- |
| Frontend        | Next.js (React, TypeScript)                   |
| CMS             | Payload CMS                                   |
| CMS Storage     | PostgreSQL                                    |
| Results Storage | MongoDB (raw + processed databases)           |
| Scraper         | [sharetelemetry-iracing-scraper](https://github.com/riccardotornesello/sharetelemetry-iracing-scraper) |
| Deployment      | Vercel (frontend + CMS)                       |

## 🛠️ Development

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/riccardotornesello/sharetelemetry-results.git
cd sharetelemetry-results

# Install dependencies
yarn install

# Start the development server
yarn run dev
```

> Note: You will need environment variables and a configured Posgres instance to run this project locally. More info coming soon in a `docs/` folder.

## 📌 Status

This project is currently in **production** and actively used, primarily by [simracingleague.it](https://simracingleague.it) for national-level championship qualifications. Its current state is **stable and sufficient** for its intended use.

Future improvements are planned, including:

- Better session management
- More detailed statistics and visualizations
- Customizable championship rules and logic

However, this is **not a high-priority project** at the moment, and development will progress **slowly and as needed**.

## 📝 Development Setup

The project includes:
- **Linting**: ESLint configuration for code quality
- **Formatting**: Prettier for consistent code style
- **Testing**: Vitest for unit tests
- **Storybook**: Component documentation and visual testing
- **Type Safety**: TypeScript for enhanced development experience

Available scripts:
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn storybook` - Start Storybook development server
- `yarn build-storybook` - Build Storybook for production

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

GNU GPLv3.
