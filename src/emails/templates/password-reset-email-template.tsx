import { FooterCenter } from "@/emails/components/footer";
import { Header } from "@/emails/components/header";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  link?: string;
  email?: string;
}

const PasswordResetEmailTemplate = ({
  link = "http://localhost:3000/auth/reset-password",
  email = "jalenparham97@gmail.com",
}: Props) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body style={{ backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '0', maxWidth: '600px' }}>
            <Container style={{ backgroundColor: '#ffffff', padding: '0' }}>
              <Header />
              <Section className="px-8 py-12">
                <Heading className="text-black text-3xl font-bold leading-tight mb-8 text-left">
                  Reset your password
                </Heading>
                <Text className="text-black text-base leading-relaxed mb-4">
                  Hi <strong className="text-black">{email}</strong>,
                </Text>
                <Text className="text-black text-base leading-relaxed mb-8">
                  We received a request to reset the password for your account.
                  To complete the password reset process, please click the
                  button below.
                </Text>
                <div className="my-10">
                  <Button 
                    className="bg-black text-white px-8 py-4 text-base font-semibold rounded-lg no-underline inline-block border-none"
                    href={link}
                  >
                    Reset password
                  </Button>
                </div>

                <Text className="text-gray-600 text-sm leading-relaxed mb-2">
                  Or copy and paste this URL into a new tab of your browser:
                </Text>
                <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                  <p className="text-blue-500 text-sm font-mono break-all hover:underline m-0">
                    {link}
                  </p>
                </div>

                <Text className="text-gray-600 text-sm leading-relaxed mt-8 mb-4">
                  If you didn&apos;t request this action, you can safely ignore
                  this email and your password will not be changed.
                </Text>
                <Text className="text-gray-600 text-sm leading-relaxed mt-4">
                  Have questions? We&apos;re here to help.{" "}
                  <Link
                    href={`mailto:support@saas-template.com`}
                    className="text-black underline"
                  >
                    Contact our support team
                  </Link>
                </Text>
              </Section>
              <FooterCenter />
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordResetEmailTemplate.PreviewProps = {};

export default PasswordResetEmailTemplate;
