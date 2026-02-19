'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for auth cookie on mount
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
    setIsLoggedIn(hasToken);
  }, []);

  const steps = [
    { id: 0, label: 'Select' },
    { id: 1, label: 'Prepare' },
    { id: 2, label: 'Upload' },
    { id: 3, label: 'Review' },
    { id: 4, label: 'Share' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setActiveStep(1); // Move to Prepare
    }
  };

  useEffect(() => {
    if (activeStep === 1 && file) {
      // Simulate processing time
      const timer = setTimeout(() => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }
        setActiveStep(2); // Move to Upload/Configure
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, file]);

  const checkSlug = async (val: string) => {
    setSlug(val);
    if (!val) {
      setSlugAvailable(null);
      return;
    }
    const res = await fetch(`/api/check-slug?slug=${val}`);
    const data = await res.json();
    setSlugAvailable(data.available);
  };

  const handleUpload = async () => {
    if (!file) return;

    setActiveStep(3); // Move to Review
  };

  const confirmUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const CHUNK_SIZE = 800 * 1024; // 800KB chunks to stay safely under 1MB Nginx limit
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = Math.random().toString(36).substring(2, 15);

    try {
      let finalResult = null;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', String(i));
        formData.append('totalChunks', String(totalChunks));
        formData.append('fileName', file.name);
        formData.append('totalSize', String(file.size));
        formData.append('fileType', file.type || 'application/octet-stream');
        formData.append('isGuest', String(!isLoggedIn));
        if (isLoggedIn && slug) {
          formData.append('customSlug', slug);
        }

        const response = await fetch('/api/upload/chunk', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));

        if (data.finalized) {
          finalResult = data;
        }
      }

      if (finalResult) {
        setResult(finalResult);
        setActiveStep(4); // Move to Share
      }
    } catch (error: any) {
      alert(error.message || 'Upload failed');
      setActiveStep(2);
    } finally {
      setIsUploading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Select
        return (
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--secondary)', opacity: 0.5 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p style={{ marginBottom: '1.25rem', fontWeight: 600, fontSize: '1.125rem' }}>Select a file to begin</p>
            <button className="btn btn-outline" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>Choose File</button>
          </div>
        );

      case 1: // Prepare
        return (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="spinner" style={{
              width: '40px', height: '40px', border: '3px solid var(--border)',
              borderTopColor: 'var(--primary)', borderRadius: '50%',
              margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite'
            }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Preparing your file...</h3>
            <p className="text-secondary">Analyzing and optimizing for secure storage.</p>
            <style jsx>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
          </div>
        );

      case 2: // Upload (Configure)
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>File Details</h3>
              <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }} />
                ) : (
                  <div style={{ width: '100%', height: '140px', background: 'var(--panel)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>📄</div>
                )}
                <p style={{ fontWeight: 700, marginBottom: '0.35rem', fontSize: '1.125rem' }}>{file?.name}</p>
                <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{(file!.size / (1024 * 1024)).toFixed(2)} MB • {file?.type || 'Unknown type'}</p>
              </div>
            </div>
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ opacity: isLoggedIn ? 1 : 0.6 }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Custom Slug {!isLoggedIn && <span>🔒</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="my-cool-file"
                      disabled={!isLoggedIn}
                      value={slug}
                      onChange={(e) => checkSlug(e.target.value)}
                      style={{
                        width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)', outline: 'none',
                        background: 'var(--panel)',
                        color: 'var(--foreground)',
                        transition: 'all 0.2s ease',
                        borderColor: slugAvailable === true ? '#22c55e' : slugAvailable === false ? '#ef4444' : 'var(--border)'
                      }}
                    />
                    {slugAvailable === false && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 600 }}>Already taken</p>}
                    {!isLoggedIn && <p className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 500 }}>Login to use custom slugs</p>}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleUpload}>Next Step</button>
              </div>
            </div>
          </div>
        );

      case 3: // Review
        return (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Final Confirmation</h3>
            <div style={{ maxWidth: '400px', margin: '0 auto', background: 'var(--background)', padding: '2rem', borderRadius: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="text-secondary">Storage Duration</span>
                <span style={{ fontWeight: 600 }}>{isLoggedIn ? 'Permanent' : '30 Days'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span className="text-secondary">Visibility</span>
                <span style={{ fontWeight: 600 }}>Public (with URL)</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={confirmUpload}
                disabled={isUploading}
              >
                {isUploading ? `Uploading ${uploadProgress}%...` : 'Confirm & Upload'}
              </button>
              {isUploading && (
                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                </div>
              )}
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '0.75rem' }} onClick={() => setActiveStep(2)}>Back</button>
            </div>
          </div>
        );

      case 4: // Share
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Deployment Successful!</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>Your file is now live and ready to shared with the world.</p>

            <div style={{ background: 'var(--panel)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', marginBottom: '2.5rem', boxShadow: 'var(--shadow)' }}>
              <code style={{ flex: 1, textAlign: 'left', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>{result?.url}</code>
              <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }} onClick={() => {
                navigator.clipboard.writeText(result?.url);
                alert('Copied!');
              }}>Copy Link</button>
            </div>

            <button className="btn btn-outline" onClick={() => {
              setFile(null);
              setPreviewUrl(null);
              setActiveStep(0);
            }}>Upload New File</button>
          </div>
        );
    }
  };

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.25rem', letterSpacing: '-0.05em', background: 'linear-gradient(to right, var(--foreground), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Upload to Filely
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '500px', fontWeight: 500 }}>
            The most secure and elegant way to share your files with the world. Instant, permanent, and beautiful.
          </p>
        </div>

        <div className="truck-anim" style={{ position: 'relative', width: '280px', height: '160px', borderRadius: '20px', background: 'var(--panel)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <svg viewBox="0 0 200 120" style={{ width: '80%', height: '80%' }}>
            <rect x="130" y="60" width="60" height="40" rx="4" fill="var(--primary)" />
            <rect x="175" y="65" width="20" height="25" rx="2" fill="#8ECAE6" opacity="0.6" />
            <rect x="100" y="70" width="40" height="30" fill="var(--primary)" opacity="0.8" />
            <circle cx="115" cy="105" r="8" fill="#1E293B" />
            <circle cx="170" cy="105" r="8" fill="#1E293B" />
            <rect x="40" y="30" width="80" height="50" rx="4" fill="#FFD166" />
            <path d="M40 35 L80 55 L120 35" stroke="#E9C46A" strokeWidth="2" fill="none" />
            <line x1="20" y1="115" x2="180" y2="115" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
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

        <div style={{ marginTop: '2rem' }}>
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
