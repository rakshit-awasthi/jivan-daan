import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";
import { GetDonorsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/donors", async (req, res) => {
  try {
    const query = GetDonorsQueryParams.parse(req.query);
    const conditions: SQL[] = [eq(usersTable.role, "donor")];
    if (query.bloodGroup) {
      conditions.push(eq(usersTable.bloodGroup, query.bloodGroup));
    }
    if (query.pinCode) {
      conditions.push(eq(usersTable.pinCode as any, query.pinCode));
    }
    const donors = await db
      .select()
      .from(usersTable)
      .where(and(...conditions));
    res.json(donors);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

export default router;
