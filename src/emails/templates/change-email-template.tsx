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

interface ChangeEmailProps {
  email?: string;
  link?: string;
}

const ChangeEmailTemplate = ({
  email = "bukinoshita@example.com",
  link = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=3862779cce10af2342b11eb5d5957ceb6797645a41c329c5200f31c2b741a32d&email=jalenparham97%40gmail.com",
}: ChangeEmailProps) => {
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
                  Change email address
                </Heading>
                <Text className="text-black text-base leading-relaxed mb-4">
                  Hi there,
                </Text>
                <Text className="text-black text-base leading-relaxed mb-8">
                  We received a request to change your email address to{" "}
                  <strong className="text-black">{email}</strong>. To complete
                  the process, please click the button below.
                </Text>
                <div className="my-10">
                  <Button 
                    className="bg-black text-white px-8 py-4 text-base font-semibold rounded-lg no-underline inline-block border-none"
                    href={link}
                  >
                    Change email address
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
                  this email and your account email will not be changed.
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

ChangeEmailTemplate.PreviewProps = {};

export default ChangeEmailTemplate;
