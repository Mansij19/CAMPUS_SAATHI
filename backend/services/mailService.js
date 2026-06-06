const isMailEnabled = () => {
  return process.env.MAIL_LOGIN_NOTIFICATIONS !== "false" && Boolean(process.env.MAIL_API_KEY);
};

const buildLoginEmail = (user) => ({
  subject: "CampusSathi login successful",
  text: `Hi ${user.name},\n\nYour CampusSathi account was just used to sign in successfully.\n\nIf this was not you, please contact your campus helpdesk immediately.\n\nCampusSathi`,
  html: `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #2563eb;">CampusSathi login successful</h2>
      <p>Hi ${user.name},</p>
      <p>Your CampusSathi account was just used to sign in successfully.</p>
      <p>If this was not you, please contact your campus helpdesk immediately.</p>
      <p>CampusSathi</p>
    </div>
  `
});

const sendWithResend = async ({ to, subject, text, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: `${process.env.MAIL_FROM_NAME || "CampusSathi"} <${process.env.MAIL_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html
    })
  });

  if (!response.ok) throw new Error(`Resend mail failed with status ${response.status}`);
};

const sendWithSendGrid = async ({ to, subject, text, html }) => {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: process.env.MAIL_FROM_EMAIL,
        name: process.env.MAIL_FROM_NAME || "CampusSathi"
      },
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html }
      ]
    })
  });

  if (!response.ok) throw new Error(`SendGrid mail failed with status ${response.status}`);
};

const sendWithGenericProvider = async ({ to, subject, text, html }) => {
  if (!process.env.MAIL_API_URL) {
    throw new Error("MAIL_API_URL is required for generic mail provider");
  }

  const response = await fetch(process.env.MAIL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: {
        email: process.env.MAIL_FROM_EMAIL,
        name: process.env.MAIL_FROM_NAME || "CampusSathi"
      },
      to,
      subject,
      text,
      html
    })
  });

  if (!response.ok) throw new Error(`Mail provider failed with status ${response.status}`);
};

export const sendSuccessfulLoginEmail = async (user) => {
  if (!isMailEnabled()) return;

  const email = buildLoginEmail(user);
  const payload = {
    to: user.email,
    ...email
  };

  const provider = (process.env.MAIL_PROVIDER || "generic").toLowerCase();

  if (provider === "resend") {
    await sendWithResend(payload);
    return;
  }

  if (provider === "sendgrid") {
    await sendWithSendGrid(payload);
    return;
  }

  await sendWithGenericProvider(payload);
};
