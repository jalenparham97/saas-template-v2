import { ResetPasswordForm } from "@/components/auth/reset-password-form";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage(props: Props) {
  const searchParams = await props.searchParams;
  return <ResetPasswordForm searchParams={searchParams} />;
}
