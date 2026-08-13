export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  gcsBucket: process.env.GCS_BUCKET ?? "",
  cloudSqlConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME ?? "",
};
