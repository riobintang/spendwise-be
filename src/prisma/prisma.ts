// import { PrismaClient } from "@prisma/client";

// import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  errorFormat: "minimal",
  // adapter,
  // datasourceUrl: `${process.env.DATABASE_URL}`,
});

export default prisma;
