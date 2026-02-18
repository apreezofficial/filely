'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [activeStep, setActiveStep] = useState(2); // 0: Select, 1: Process, 2: Upload, 3: Review, 4: Share
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 0, label: 'Select' },
    { id: 1, label: 'Prepare' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Review' },
    { id: 4, label: 'Share' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isGuest', 'true');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      setActiveStep(4);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Upload your files to Filely</h1>
          <p className="text-secondary" style={{ fontSize: '1.125rem' }}>
            Get a permanent URL for your files. Quick, secure, and hassle-free.
          </p>
        </div>

        <div style={{ position: 'relative', width: '200px', height: '120px' }}>
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <rect x="130" y="60" width="60" height="40" rx="4" fill="#0066FF" />
            <rect x="175" y="65" width="20" height="25" rx="2" fill="#8ECAE6" />
            <rect x="100" y="70" width="40" height="30" fill="#0052CC" />
            <circle cx="115" cy="105" r="8" fill="#1E293B" />
            <circle cx="170" cy="105" r="8" fill="#1E293B" />
            <rect x="40" y="30" width="80" height="50" rx="4" fill="#FFD166" />
            <path d="M40 35 L80 55 L120 35" stroke="#E9C46A" strokeWidth="2" />
            <rect x="75" y="45" width="10" height="10" fill="#E9C46A" />
            <line x1="20" y1="115" x2="180" y2="115" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="card">
        <div className="stepper">
          {steps.map((step) => (
            <div key={step.id} className={`step ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}>
              <div className="step-indicator">
                {activeStep > step.id ? '✓' : step.id + 1}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          {activeStep === 4 && result ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Upload Successful!</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>Your file is ready to share.</p>

              <div style={{
                background: 'var(--background)',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border)',
                marginBottom: '2rem'
              }}>
                <code style={{ fontWeight: 600 }}>{result.url}</code>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                  onClick={() => {
                    navigator.clipboard.writeText(result.url);
                    alert('Copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>

              <button className="btn btn-outline" onClick={() => {
                setFile(null);
                setResult(null);
                setActiveStep(2);
              }}>Upload Another</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Upload your files</h2>

              <div className="badge-info">
                <span style={{ fontSize: '1.25rem' }}>ⓘ</span>
                <div>
                  <strong>Files are stored permanently for account holders.</strong>
                  <p style={{ margin: 0, opacity: 0.8 }}>
                    Guest uploads are automatically deleted after 30 days. No account required to start.
                  </p>
                </div>
              </div>

              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  borderColor: file ? 'var(--primary)' : 'var(--border)',
                  background: file ? 'rgba(0, 102, 255, 0.05)' : ''
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <div style={{ marginBottom: '1.5rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{
                    color: file ? 'var(--primary)' : 'var(--secondary)',
                    opacity: file ? 1 : 0.5
                  }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p style={{ marginBottom: '1rem', fontWeight: 500 }}>
                  {file ? file.name : 'Drag and drop your files here, or'}
                </p>
                <button className="btn btn-outline" style={{ background: 'white' }}>
                  {file ? 'Change file' : 'Select a file'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-outline">Back</button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Continue'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
          Trusted by thousands of users for quick and reliable file sharing.
        </p>
      </div>
    </div>
  );
}
