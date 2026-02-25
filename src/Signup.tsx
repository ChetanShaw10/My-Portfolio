
import { useState } from 'react';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Real OTP sending
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('OTP sent to your email!');
        setStep('otp');
        // Optionally: show previewUrl for Ethereal
        if (data.previewUrl) {
          setSuccess(prev => prev + ` (Preview: ${data.previewUrl})`);
        }
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };

  // Real OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Account created! You can now log in.');
        setStep('signup');
        setOtp('');
        setPassword('');
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={step === 'signup' ? handleSendOtp : handleVerifyOtp}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {step === 'signup' ? (
          <>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
            />
            <button type="submit">Send OTP</button>
          </>
        ) : (
          <>
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              maxLength={6}
            />
            <button type="submit">Verify OTP</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Signup;
