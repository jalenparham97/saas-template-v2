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
import { FooterCenter } from "../components/footer";
import { Header } from "../components/header";

interface VerifyEmailProps {
  email?: string;
  link?: string;
}

const VerifyEmailTemplate = ({
  email = "bukinoshita@example.com",
  link = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=3862779cce10af2342b11eb5d5957ceb6797645a41c329c5200f31c2b741a32d&email=jalenparham97%40gmail.com",
}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body
          style={{
            backgroundColor: "#ffffff",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <Container
            style={{
              backgroundColor: "#ffffff",
              margin: "0 auto",
              padding: "0",
              maxWidth: "600px",
            }}
          >
            <Container style={{ backgroundColor: "#ffffff", padding: "0" }}>
              <Header />
              <Section className="px-8 py-12">
                <Heading className="mb-8 text-left text-3xl leading-tight font-bold text-black">
                  Verify your email address
                </Heading>
                <Text className="mb-4 text-base leading-relaxed text-black">
                  Hi <strong className="text-black">{email}</strong>,
                </Text>
                <Text className="mb-8 text-base leading-relaxed text-black">
                  We received a request to verify your email address. To
                  complete the verification process, please click the button
                  below.
                </Text>
                <div className="my-10">
                  <Button
                    className="inline-block rounded-lg border-none bg-black px-8 py-4 text-base font-semibold text-white no-underline"
                    href={link}
                  >
                    Verify email address
                  </Button>
                </div>

                <Text className="mb-2 text-sm leading-relaxed text-gray-600">
                  Or copy and paste this URL into a new tab of your browser:
                </Text>
                <div className="mb-6 rounded-lg border bg-gray-50 p-4">
                  <p className="m-0 font-mono text-sm break-all text-blue-500 hover:underline">
                    {link}
                  </p>
                </div>

                <Text className="mt-8 mb-4 text-sm leading-relaxed text-gray-600">
                  If you didn&apos;t request this action, you can safely ignore
                  this email and no changes will be made to your account.
                </Text>
                <Text className="mt-4 text-sm leading-relaxed text-gray-600">
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

VerifyEmailTemplate.PreviewProps = {};

export default VerifyEmailTemplate;
