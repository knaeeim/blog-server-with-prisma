export const verifyEmailTemplate = (verifyUrl: string, userName = "there") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#2563eb; padding:20px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px;">
                Blog App by Prisma
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; margin:0 0 12px;">
                Hi <strong>${userName}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.6; margin:0 0 20px;">
                Thanks for signing up! Please verify your email address to activate your account.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${verifyUrl}"
                   style="background:#2563eb; color:#ffffff; text-decoration:none;
                          padding:14px 26px; font-size:16px; border-radius:6px;
                          display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; line-height:1.6; color:#555;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px; word-break:break-all; color:#2563eb;">
                ${verifyUrl}
              </p>

              <p style="font-size:14px; margin-top:25px; color:#555;">
                If you didn’t create this account, you can safely ignore this email.
              </p>

              <p style="font-size:14px; margin-top:20px;">
                — The Blog App Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Blog App by Prisma. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
