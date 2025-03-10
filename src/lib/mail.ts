import ChangeEmailTemplate from "@/emails/templates/change-email-template";
import PasswordResetEmailTemplate from "@/emails/templates/password-reset-email-template";
import VerifyEmailTemplate from "@/emails/templates/verify-email-template";
import { env } from "@/env";
import { APP_NAME } from "@/lib/contants";
import { render } from "@react-email/components";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

const emailFrom = `${APP_NAME} <accounts@formbox.app>`;

export async function sendPasswordResetEmail(email: string, link: string) {
  const emailTemplate = PasswordResetEmailTemplate({ email, link });

  const text = await render(emailTemplate, { plainText: true });

  return await resend.emails.send({
    subject: "Reset your password",
    from: emailFrom,
    to: email,
    text,
    react: emailTemplate,
  });
}

export async function sendVerifyEmail(email: string, link: string) {
  const emailTemplate = VerifyEmailTemplate({ email, link });

  const text = await render(emailTemplate, { plainText: true });

  return await resend.emails.send({
    subject: "Verify your email address",
    from: emailFrom,
    to: email,
    text,
    react: emailTemplate,
  });
}

export async function sendEmailChangeEmail(
  email: string,
  newEmail: string,
  link: string,
) {
  const emailTemplate = ChangeEmailTemplate({ email: newEmail, link });

  const text = await render(emailTemplate, { plainText: true });

  return await resend.emails.send({
    subject: "Change your email address",
    from: emailFrom,
    to: email,
    text,
    react: emailTemplate,
  });
}
