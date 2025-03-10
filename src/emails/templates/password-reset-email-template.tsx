import { FooterCenter } from "@/emails/components/footer";
import { Header } from "@/emails/components/header";
import {
  button,
  container,
  h1,
  text,
  wrapper,
} from "@/emails/components/sharedStyles";
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
        <Body style={wrapper}>
          <Container style={wrapper}>
            <Container style={container}>
              <Header />
              <Section className="px-6 py-10">
                <Heading style={{ ...h1 }}>Reset password</Heading>
                <Text style={text} className="py-2">
                  Hi, <strong className="text-black">{email}</strong>,
                </Text>
                <Text style={text} className="pb-4">
                  We received a request to reset the password for your account.
                  To complete the password reset process, please click the
                  button below.
                </Text>
                <Button style={button} href={link}>
                  Reset password
                </Button>

                <Text style={text} className="pt-4">
                  If you didn&apos;t request this action, you can safely ignore
                  this email and your password will not be changed.
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

PasswordResetEmailTemplate.PreviewProps = {};

export default PasswordResetEmailTemplate;
