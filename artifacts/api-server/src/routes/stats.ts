import { Router, type IRouter } from "express";
import { db, usersTable, requestsTable, hospitalsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [donorRows, requestRows, hospitalRows] = await Promise.all([
      db.select().from(usersTable).where(eq(usersTable.role, "donor")),
      db.select().from(requestsTable),
      db.select().from(hospitalsTable),
    ]);
    res.json({
      totalDonors: donorRows.length,
      totalRequests: requestRows.length,
      totalHospitals: hospitalRows.length,
      livesSaved: Math.floor(requestRows.filter(r => r.status === "fulfilled").length * 1 + donorRows.length * 0.8),
    });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

export default router;
