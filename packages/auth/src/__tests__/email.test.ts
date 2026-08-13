import { describe, expect, it, beforeEach } from "vitest";
import { __setMailerForTests, sendEmail, sendMagicLink } from "../email";

interface CapturedMessage {
  to: string;
  subject: string;
  text: string;
}

const captured: CapturedMessage[] = [];
const capturingMailer = {
  async send(input: { to: string; subject: string; text: string }) {
    captured.push({ to: input.to, subject: input.subject, text: input.text });
  },
};

describe("email", () => {
  beforeEach(() => {
    captured.length = 0;
    __setMailerForTests(capturingMailer);
  });

  it("sendEmail forwards to the mailer", async () => {
    await sendEmail({
      to: "a@b.com",
      subject: "Hi",
      text: "Body",
    });
    expect(captured).toHaveLength(1);
    expect(captured[0]?.subject).toBe("Hi");
  });

  it("sendMagicLink includes the URL and TTL", async () => {
    await sendMagicLink({ to: "a@b.com", url: "https://example.com/p?token=t", ttlHours: 24 });
    expect(captured[0]?.text).toContain("https://example.com/p?token=t");
    expect(captured[0]?.text).toContain("24 hour");
  });
});
