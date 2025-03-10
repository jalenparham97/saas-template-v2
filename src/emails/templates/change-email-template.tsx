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
import {
  button,
  container,
  h1,
  text,
  wrapper,
} from "../components/sharedStyles";

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
        <Body style={wrapper}>
          <Container style={wrapper}>
            <Container style={container}>
              <Header />
              <Section className="px-6 py-10">
                <Heading style={{ ...h1 }}>Change email address</Heading>
                <Text style={text} className="py-2">
                  Hi there,
                </Text>
                <Text style={text} className="pb-4">
                  We received a request to change your email address to{" "}
                  <strong className="text-black">{email}</strong>. To complete
                  the process, please click the button below.
                </Text>
                <Button style={button} href={link}>
                  Change email address
                </Button>

                <Text style={text} className="pt-4">
                  If you didn&apos;t request this action, you can safely ignore
                  this email and your account email will not be changed.
                </Text>
                <Text style={text} className="pt-4">
                  Have questions? We&apos;re here to help.{" "}
                  <Link
                    href={`mailto:support@formbox.app`}
                    className="text-blue-600 no-underline"
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
