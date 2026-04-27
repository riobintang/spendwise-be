export type DatabaseHealth = {
  status: "ok" | "error";
  latencyMs: number;
  error?: string;
};

export type HealthCheckResult = {
  status: "ok" | "error";
  timestamp: string;
  uptimeSeconds: number;
  database: DatabaseHealth;
};
