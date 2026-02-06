import { Request, Response, Router } from "express";
import z from "zod";

const router = Router();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

const pendingSignups = new Map<
  string,
  { name: string; password: string; otp: string; createdAt: number }
>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isOtpExpired(createdAt: number): boolean {
  return Date.now() - createdAt > OTP_TTL_MS;
}

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/signup", (req: Request, res: Response) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);

    // TODO: Check if user already exists in database
    const otp = generateOtp();
    pendingSignups.set(email.toLowerCase(), {
      name,
      password,
      otp,
      createdAt: Date.now(),
    });

    // TODO: Send OTP to email (e.g. via nodemailer, SendGrid, etc.)
    console.log(`[dev] OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message:
        "Signup initiated. Check your email for the OTP to complete registration.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Invalid request" });
  }
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

router.post("/verify-otp", (req: Request, res: Response) => {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const key = email.toLowerCase();
    const pending = pendingSignups.get(key);

    if (!pending) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No signup found for this email. Please sign up first.",
        });
    }

    if (isOtpExpired(pending.createdAt)) {
      pendingSignups.delete(key);
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP expired. Please sign up again.",
        });
    }

    if (pending.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }

    pendingSignups.delete(key);

    // TODO: Create user in database (pending.name, email, pending.password)
    res.json({
      success: true,
      message: "Email verified. Account created successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Invalid request" });
  }
});

export default router;
