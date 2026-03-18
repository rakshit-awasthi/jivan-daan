import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateUserBody,
  UpdateUserBody,
  GetUserParams,
  UpdateUserParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/users", async (req, res) => {
  try {
    const body = CreateUserBody.parse(req.body);
    const existing = await db.select().from(usersTable).where(eq(usersTable.uid, body.uid)).limit(1);
    if (existing.length > 0) {
      const updated = await db
        .update(usersTable)
        .set({
          name: body.name,
          email: body.email,
          role: body.role,
          bloodGroup: body.bloodGroup,
          location: body.location,
          pinCode: body.pinCode ?? null,
          image: body.image ?? null,
          hospitalName: body.hospitalName ?? null,
          contact: body.contact ?? null,
        })
        .where(eq(usersTable.uid, body.uid))
        .returning();
      res.json(updated[0]);
    } else {
      const created = await db.insert(usersTable).values({
        uid: body.uid,
        name: body.name,
        email: body.email,
        role: body.role,
        bloodGroup: body.bloodGroup,
        location: body.location,
        pinCode: body.pinCode ?? null,
        image: body.image ?? null,
        hospitalName: body.hospitalName ?? null,
        contact: body.contact ?? null,
      }).returning();
      res.json(created[0]);
    }
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.get("/users/:uid", async (req, res) => {
  try {
    const { uid } = GetUserParams.parse(req.params);
    const users = await db.select().from(usersTable).where(eq(usersTable.uid, uid)).limit(1);
    if (users.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(users[0]);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.put("/users/:uid", async (req, res) => {
  try {
    const { uid } = UpdateUserParams.parse(req.params);
    const body = UpdateUserBody.parse(req.body);
    const updated = await db
      .update(usersTable)
      .set({
        ...(body.name !== undefined && { name: body.name }),
        ...(body.bloodGroup !== undefined && { bloodGroup: body.bloodGroup }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.pinCode !== undefined && { pinCode: body.pinCode }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.hospitalName !== undefined && { hospitalName: body.hospitalName }),
        ...(body.contact !== undefined && { contact: body.contact }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
      })
      .where(eq(usersTable.uid, uid))
      .returning();
    if (updated.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(updated[0]);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

export default router;
