# SharedTelemetry Results

<img src="doc/logo.png" width="300" alt="Shared Telemetry logo" />

[![Production Site](https://img.shields.io/badge/live-site-green?style=flat-square)](https://results.sharedtelemetry.com)

**SharedTelemetry Results** is a real-time race results platform built with [Next.js](https://nextjs.org/) and powered by the [Payload CMS](https://payloadcms.com/), designed to handle multi-session qualifications and deliver live data updates during competitive sim racing events.

> 🌐 Live site: [results.sharedtelemetry.com](https://results.sharedtelemetry.com)

## 🏗️ Architecture overview

The platform combines a modern web frontend, a headless CMS, and multiple data backends to deliver real-time and structured information.

### 🔹 Frontend

- Built with **Next.js** (React + TypeScript)
- Deployed on **[Vercel](https://vercel.com/)** for fast and scalable production hosting

### 🔹 CMS (Content Management System)

- Powered by **Payload CMS**
- Stores structured data about:
  - Competitions
  - Drivers
- Connected to a **PostgreSQL** database for persistent data storage

### 🔹 Real-Time Data (iRacing Integration)

- Real-time session and lap data from **iRacing** is:
  - Collected by a dedicated scraper
  - Stored in a **Firestore** (NoSQL) database for fast access and updates
- Data ingestion is handled by the companion project:
  👉 [sharedtelemetry-iracing-scraper](https://github.com/riccardotornesello/sharedtelemetry-iracing-scraper)
  - Hosted on **Google Cloud**
  - Pushes live updates to Firestore during active sessions

## ⚙️ Features

- Real-time results for multi-session qualifications
- Visual breakdown of each session and driver performance
- Structured event management through Payload CMS
- Seamless combination of static competition data and live updates
- Currently integrated with **iRacing**
- Actively used by [simracingleague.it](https://simracingleague.it) for national championship qualifications

## 📦 Tech Stack

| Layer       | Tech                         |
| ----------- | ---------------------------- |
| Frontend    | Next.js (React, TypeScript)  |
| CMS         | Payload CMS                  |
| CMS Storage | PostgreSQL                   |
| Live Data   | Firestore (Google Cloud)     |
| Scraper     | GoLang scraper hosted on GCP |
| Deployment  | Vercel (frontend + CMS)      |

## 🛠️ Development

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/riccardotornesello/sharedtelemetry-results.git
cd sharedtelemetry-results

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

## 📝 Next steps

- Linting, formatting and testing setup
- Pipelines and git hooks for code quality
- Local environment setup documentation
- Storybook

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

GNU GPLv3.
