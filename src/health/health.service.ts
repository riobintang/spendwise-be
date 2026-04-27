import prisma from "../prisma/prisma";
import { HealthCheckResult } from "./health.type";

const appStartedAt = Date.now();

export async function checkHealth(): Promise<HealthCheckResult> {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - appStartedAt) / 1000),
      database: {
        status: "ok",
        latencyMs: Date.now() - startedAt,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";

    return {
      status: "error",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - appStartedAt) / 1000),
      database: {
        status: "error",
        latencyMs: Date.now() - startedAt,
        error: message,
      },
    };
  }
}
