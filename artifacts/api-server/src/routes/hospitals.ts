import { Router, type IRouter } from "express";
import { db, hospitalsTable } from "@workspace/db";
import { CreateHospitalBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/hospitals", async (_req, res) => {
  try {
    const hospitals = await db.select().from(hospitalsTable);
    res.json(hospitals.map(h => ({ ...h, createdAt: h.createdAt.toISOString() })));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.post("/hospitals", async (req, res) => {
  try {
    const body = CreateHospitalBody.parse(req.body);
    const created = await db.insert(hospitalsTable).values({
      uid: body.uid,
      name: body.name,
      location: body.location,
      contact: body.contact,
      email: body.email,
    }).returning();
    res.status(201).json({ ...created[0], createdAt: created[0].createdAt.toISOString() });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

export default router;
