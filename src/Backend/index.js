const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory store for OTPs (for demo only)
const otpStore = {};

// Create a test SMTP account (Ethereal)
let testAccount;
let transporter;
(async () => {
  testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
})();

// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const otp = generateOTP();
  otpStore[email] = otp;

  // Send email
  try {
    const info = await transporter.sendMail({
      from: 'OTP Demo <no-reply@example.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<b>Your OTP code is: ${otp}</b>`
    });
    res.json({ success: true, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid OTP' });
});

app.listen(PORT, () => {
  console.log(`OTP backend running on http://localhost:${PORT}`);
});
