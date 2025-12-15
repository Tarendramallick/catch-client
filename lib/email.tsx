import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CatchClients <onboarding@catchclients.com>",
      to: email,
      subject: "Welcome to CatchClients!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to CatchClients</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <div style="display: inline-block; width: 64px; height: 64px; background: white; border-radius: 16px; margin-bottom: 20px; line-height: 64px; font-size: 32px; font-weight: bold; color: #2563eb;">
                  CC
                </div>
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Welcome to CatchClients!</h1>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 18px; color: #111827; margin-top: 0;">Hi ${name},</p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  Thank you for joining CatchClients! We're excited to have you on board. Your account has been successfully created.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  CatchClients is a modern CRM platform designed to help you:
                </p>
                
                <ul style="font-size: 16px; line-height: 1.8; color: #4b5563; margin: 20px 0;">
                  <li>Manage client relationships effectively</li>
                  <li>Track leads and deals through your pipeline</li>
                  <li>Collaborate with your team seamlessly</li>
                  <li>Analyze your sales performance</li>
                </ul>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${baseUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Go to Dashboard
                  </a>
                </div>
                
                <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-bottom: 0;">
                  If you have any questions or need help getting started, feel free to reach out to our support team.
                </p>
                
                <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-top: 20px; margin-bottom: 0;">
                  Best regards,<br>
                  The CatchClients Team
                </p>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2025 Catch22Digital. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Email error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Failed to send welcome email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CatchClients <security@catchclients.com>",
      to: email,
      subject: "Reset Your Password - CatchClients",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <div style="display: inline-block; width: 64px; height: 64px; background: white; border-radius: 16px; margin-bottom: 20px; line-height: 64px; font-size: 32px; font-weight: bold; color: #2563eb;">
                  CC
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-top: 0;">
                  We received a request to reset your password for your CatchClients account.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  Click the button below to reset your password. This link will expire in 1 hour.
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Reset Password
                  </a>
                </div>
                
                <p style="font-size: 14px; line-height: 1.6; color: #6b7280; background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
                
                <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-top: 30px; margin-bottom: 0;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
                </p>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2025 Catch22Digital. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Email error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Failed to send password reset email:", error)
    throw error
  }
}

export async function sendNotificationEmail(email: string, subject: string, message: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CatchClients <notifications@catchclients.com>",
      to: email,
      subject: `CatchClients - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: bold; color: white;">
                    CC
                  </div>
                </div>
                
                <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">${subject}</h2>
                
                <div style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  ${message}
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${baseUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    View in Dashboard
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">© 2025 Catch22Digital. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Email error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("[v0] Failed to send notification email:", error)
    throw error
  }
}
