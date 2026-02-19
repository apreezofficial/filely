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
      setActiveStep(1);
    }
  };

  useEffect(() => {
    if (activeStep === 1 && file) {
      const timer = setTimeout(() => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }
        setActiveStep(2);
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
    setActiveStep(3);
  };

  const confirmUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const CHUNK_SIZE = 800 * 1024;
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
        if (data.finalized) finalResult = data;
      }

      if (finalResult) {
        setResult(finalResult);
        setActiveStep(4);
      }
    } catch (error: any) {
      alert(error.message || 'Upload failed');
      setActiveStep(2);
    } finally {
      setIsUploading(false);
    }
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', opacity: 0.8 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p style={{ marginBottom: '1.25rem', fontWeight: 700, fontSize: '1.25rem' }}>Drop or Select File</p>
            <button className="btn btn-outline" style={{ background: 'var(--panel)' }}>Choose File</button>
          </div>
        );
      case 1:
        return (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 2rem auto' }} />
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Analyzing...</h3>
            <p className="text-secondary" style={{ fontWeight: 500 }}>Optimizing your file for high-speed delivery.</p>
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.125rem' }}>File Details</h3>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', background: 'var(--panel)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid var(--border)' }}>📄</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file?.name}</p>
                  <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{(file!.size / (1024 * 1024)).toFixed(2)} MB • {file?.type || 'Unknown'}</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem' }}>Settings</h3>
              <div style={{ opacity: isLoggedIn ? 1 : 0.6 }}>
                <label style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', fontWeight: 600 }}>Custom Slug {!isLoggedIn && "🔒"}</label>
                <input
                  type="text"
                  placeholder="my-cool-link"
                  disabled={!isLoggedIn}
                  value={slug}
                  onChange={(e) => checkSlug(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--foreground)', outline: 'none', transition: 'all 0.2s ease', borderColor: slugAvailable === true ? '#22c55e' : slugAvailable === false ? '#ef4444' : 'var(--border)' }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleUpload} style={{ padding: '1rem' }}>Next Step</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Ready to share?</h3>
            <div style={{ background: 'var(--background)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span className="text-secondary" style={{ fontWeight: 500 }}>Duration</span>
                <span style={{ fontWeight: 700 }}>{isLoggedIn ? 'Permanent' : '30 Days'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span className="text-secondary" style={{ fontWeight: 500 }}>Access</span>
                <span style={{ fontWeight: 700 }}>Public Link</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={confirmUpload} disabled={isUploading}>
                {isUploading ? `Uploading ${uploadProgress}%` : 'Finalize & Upload'}
              </button>
              {isUploading && (
                <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', marginTop: '1.25rem', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                </div>
              )}
            </div>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setActiveStep(2)}>Go Back</button>
          </div>
        );
      case 4:
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>⚡</div>
            <h2 style={{ marginBottom: '0.75rem', fontSize: '2rem' }}>Link Generated!</h2>
            <p className="text-secondary" style={{ marginBottom: '2.5rem', fontWeight: 500 }}>Share your file instantly with anyone.</p>
            <div style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', marginBottom: '2.5rem', boxShadow: 'var(--shadow)' }}>
              <code style={{ flex: 1, textAlign: 'left', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>{result?.url}</code>
              <button className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }} onClick={() => { navigator.clipboard.writeText(result?.url); alert('Copied!'); }}>Copy</button>
            </div>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setFile(null); setPreviewUrl(null); setActiveStep(0); setUploadProgress(0); }}>Upload Another</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-0.06em', background: 'linear-gradient(to right, var(--foreground), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Filely
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
          The fastest, most elegant cloud storage for quick sharing.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
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

        <div className="step-container">
          <div className="step-slider" style={{ transform: `translateX(-${activeStep * 100}%)` }}>
            {steps.map((_, index) => (
              <div key={index} className="step-content">
                {renderStepContent(index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
