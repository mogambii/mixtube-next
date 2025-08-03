"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailResend({ to, subject, html }, fromAddress) {
  try {
    const from = fromAddress || "MixTapped <noreply@mixtapped.com>";

    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
