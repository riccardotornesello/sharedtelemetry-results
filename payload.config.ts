import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import {
  buildConfig,
  type Field,
  type CollectionConfig,
  Endpoint,
} from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { deleteCacheByPrefix } from "./lib/redis";
import { getCompetitionSessionsCsv } from "./features/ranking/utils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const downloadEndpoint: Endpoint = {
  path: "/:slug/csv",
  method: "get",
  async handler(req) {
    if (!req.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const slug = req?.routeParams?.slug as string | undefined;
    if (!slug) {
      return Response.json({ message: "Slug is required" }, { status: 400 });
    }

    const csv = await getCompetitionSessionsCsv(slug);
    if (!csv) {
      return Response.json({ message: "No data available" }, { status: 404 });
    }

    return new Response(csv.toString(), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="competition-${slug}.csv"`,
      },
    });
  },
};

const Drivers: Field = {
  name: "drivers",
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "firstName",
          type: "text",
          required: true,
        },
        {
          name: "lastName",
          type: "text",
          required: true,
        },
        {
          name: "iRacingId",
          type: "number",
          required: true,
        },
      ],
    },
  ],
};

const Crews: Field = {
  name: "crews",
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "class",
          type: "text",
          required: false,
        },
        {
          name: "iRacingCarId",
          type: "number",
          required: true,
        },
      ],
    },
    Drivers,
  ],
};

const Teams: Field = {
  name: "teams",
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "pictureUrl",
          type: "text",
          required: false,
        },
      ],
    },
    Crews,
  ],
};

const Classes: Field = {
  name: "classes",
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "color",
          type: "text",
          required: true,
          defaultValue: "",
          admin: {
            components: {
              Field: "@/features/admin/components/color-picker",
            },
          },
        },
      ],
    },
  ],
};

const EventSesions: Field = {
  name: "sessions",
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "fromTime",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
            },
          },
        },
        {
          name: "toTime",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
            },
          },
        },
      ],
    },
  ],
};

const EventGroups: Field = {
  name: "eventGroups",
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "iRacingTrackId",
          type: "number",
        },
      ],
    },
    EventSesions,
  ],
};

const CompetitionCollection: CollectionConfig = {
  slug: "competitions",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "leagueId",
          type: "number",
          required: true,
        },
        {
          name: "seasonId",
          type: "number",
          required: true,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "crewDriversCount",
      type: "number",
      required: true,
    },
    Classes,
    Teams,
    EventGroups,
    {
      name: "csv",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/features/admin/components/download-csv-button",
        },
        condition: (data) => {
          return data && data.slug;
        },
      },
    },
    {
      name: "visit",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/features/admin/components/visit-competition-results-button",
        },
        condition: (data) => {
          return data && data.slug;
        },
      },
    },
  ],
  admin: {
    components: {
      beforeListTable: ["@/features/admin/components/cache-clear-button"],
    },
  },
  hooks: {
    afterChange: [
      async () => {
        await deleteCacheByPrefix("competitionRanking:");
      },
    ],
  },
};

function getDbAdapter() {
  const databaseUrL = process.env.POSTGRES_URL;

  if (!databaseUrL) {
    // For local development, use SQLite
    return sqliteAdapter({
      client: {
        url: "file:local.db",
        authToken: "your-auth-token",
      },
    });
  } else {
    return postgresAdapter({
      pool: {
        connectionString: databaseUrL,
      },
    });
  }
}

export default buildConfig({
  editor: lexicalEditor(),
  collections: [CompetitionCollection],
  secret: process.env.PAYLOAD_SECRET || "",
  db: getDbAdapter(),
  sharp,
  endpoints: [downloadEndpoint],
});
