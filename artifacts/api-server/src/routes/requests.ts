import { Router, type IRouter } from "express";
import { db, requestsTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";
import { CreateBloodRequestBody, GetBloodRequestsQueryParams, DeleteBloodRequestParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/requests", async (req, res) => {
  try {
    const query = GetBloodRequestsQueryParams.parse(req.query);
    const conditions: SQL[] = [];
    if (query.bloodGroup) {
      conditions.push(eq(requestsTable.bloodGroup, query.bloodGroup));
    }
    if (query.urgency) {
      conditions.push(eq(requestsTable.urgency, query.urgency));
    }
    const requests = conditions.length > 0
      ? await db.select().from(requestsTable).where(and(...conditions))
      : await db.select().from(requestsTable);
    res.json(requests.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.post("/requests", async (req, res) => {
  try {
    const body = CreateBloodRequestBody.parse(req.body);
    const created = await db.insert(requestsTable).values({
      bloodGroup: body.bloodGroup,
      location: body.location,
      urgency: body.urgency,
      patientName: body.patientName,
      units: body.units,
      contactNumber: body.contactNumber,
      description: body.description ?? null,
      createdBy: body.createdBy,
      createdByName: body.createdByName,
      status: "active",
    }).returning();
    res.status(201).json({ ...created[0], createdAt: created[0].createdAt.toISOString() });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.delete("/requests/:id", async (req, res) => {
  try {
    const { id } = DeleteBloodRequestParams.parse({ id: Number(req.params.id) });
    await db.delete(requestsTable).where(eq(requestsTable.id, id));
    res.json({ success: true, message: "Request deleted" });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

export default router;
