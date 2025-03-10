import { APP_NAME } from "@/lib/contants";
import { Hr, Img, Section } from "@react-email/components";
import * as React from "react";

const baseUrl = "https://formbox.app";

export function Header() {
  return (
    <>
      <Section className="h-16 px-6" align="center">
        {APP_NAME}
        {/* <Img
          src={`${baseUrl}/formbox-logo.png`}
          width="52"
          height="52"
          alt="Formbox Logo"
          className="my-2 rounded-xl"
        /> */}
      </Section>
      <Hr style={hr} />
    </>
  );
}

const hr = {
  borderColor: "#F1F1F4",
  margin: "0",
};
