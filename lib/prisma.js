// Singleton Prisma client with graceful fallback.
// If Prisma client hasn't been generated yet (npx prisma generate),
// falls back to logging so the API still responds 200.

let prisma = null;
let prismaError = null;

try {
  // Dynamic require so the build doesn't fail if @prisma/client isn't generated
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis;

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch (err) {
  prismaError = err.message;
  console.warn(
    "[prisma] Client not generated yet. Run: npx prisma generate && npx prisma migrate dev --name init"
  );
}

export { prisma, prismaError };
export default prisma;
