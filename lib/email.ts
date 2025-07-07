import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendSessionConfirmationEmail = async (
  to: string,
  teacherName: string,
  learnerName: string,
  skillName: string,
  sessionDate: Date
) => {
  await resend.emails.send({
    from: 'Upskillrr <noreply@upskillrr.com>',
    to,
    subject: 'Your Upcoming Session is Confirmed!',
    html: `
      <h1>Session Confirmed!</h1>
      <p>Hi ${learnerName},</p>
      <p>Your session with <strong>${teacherName}</strong> to learn <strong>${skillName}</strong> has been confirmed.</p>
      <p><strong>Date:</strong> ${sessionDate.toLocaleString()}</p>
      <p>Get ready to learn and grow!</p>
      <p>The Upskillrr Team</p>
    `,
  })
}

export const sendNewSessionRequestEmail = async (
  to: string,
  teacherName: string,
  learnerName: string,
  skillName: string,
  sessionDate: Date,
  message?: string
) => {
  await resend.emails.send({
    from: 'Upskillrr <noreply@upskillrr.com>',
    to,
    subject: 'New Session Request!',
    html: `
      <h1>New Session Request!</h1>
      <p>Hi ${teacherName},</p>
      <p><strong>${learnerName}</strong> has requested a session with you to learn <strong>${skillName}</strong>.</p>
      <p><strong>Requested Date:</strong> ${sessionDate.toLocaleString()}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <p>Please log in to your dashboard to confirm or cancel the request.</p>
      <p>The Upskillrr Team</p>
    `,
  })
}

export const sendSessionCancellationEmail = async (
  to: string,
  userName: string,
  otherUserName: string,
  skillName: string,
  sessionDate: Date
) => {
  await resend.emails.send({
    from: 'Upskillrr <noreply@upskillrr.com>',
    to,
    subject: 'A Session has been Cancelled',
    html: `
      <h1>Session Cancelled</h1>
      <p>Hi ${userName},</p>
      <p>Your session with <strong>${otherUserName}</strong> for <strong>${skillName}</strong> on <strong>${sessionDate.toLocaleString()}</strong> has been cancelled.</p>
      <p>Please visit your dashboard for more details. You can always find new mentors or learners to connect with.</p>
      <p>The Upskillrr Team</p>
    `,
  })
} 