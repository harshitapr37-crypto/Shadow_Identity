import React, { useState } from 'react';
import './App.css';

function App() {
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setScanResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, emailAddress }),
      });

      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Error during scan:", error);
      setScanResult({ is_fraud_detected: false, error: "Connection error." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Detect Fraudulent Accounts</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Scanning...' : 'Scan for Identity Theft'}
          </button>
        </form>
      </div>

      {scanResult && (
        <div className="result-box">
          <h3>Scan Result</h3>
          {scanResult.is_fraud_detected ? (
            <div>
              <p><strong⚠️ Fraudulent account detected!</strong></p>
              <p><strong>Platform:</strong> {scanResult.fraudulent_account.social_media}</p>
              <p><strong>Name:</strong> {scanResult.fraudulent_account.full_name}</p>
              <p><strong>Username:</strong> {scanResult.fraudulent_account.username}</p>
              <p><strong>Email:</strong> {emailAddress}</p>
            </div>
          ) : (
            <p>No fraudulent accounts found. ✅</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
