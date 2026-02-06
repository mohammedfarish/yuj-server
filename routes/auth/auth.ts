import { Request, Response, Router } from "express";
import z from "zod";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/login", (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    console.log(email, password);

    const expectedEmail = "test@test.com";
    const expectedPassword = "password";

    if (email !== expectedEmail || password !== expectedPassword) {
      return res
        .json({ success: false, message: "Invalid credentials" })
        .status(401);
    }

    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid request" }).status(500);
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  // TODO: invalidate session/token when auth is implemented
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
