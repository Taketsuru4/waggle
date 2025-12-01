import { Resend } from "resend";

// Initialize Resend client
// The API key should be set in .env.local as RESEND_API_KEY
// Use a dummy key for build time if not set
const resend = new Resend(
  process.env.RESEND_API_KEY || "re_placeholder_for_build",
);

export { resend };
