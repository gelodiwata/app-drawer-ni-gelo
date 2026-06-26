'use client'
import React, { useState, useEffect } from 'react';

const RendererComponent = ({ filePath, onBack }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load HTML');
        return res.text();
      })
      .then((data) => setHtmlContent(data))
      .catch((err) => console.error(err));
  }, [filePath]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header
        style={{
          flexShrink: 0,
          height: '60px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            color: '#007aff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,122,255,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ← Back to Home
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#666', fontWeight: '500' }}>
          {filePath.replace(/^\//, '').replace(/\.html$/, '')}
        </span>
      </header>

      <iframe
        srcDoc={htmlContent}
        title="HTML Page"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    </div>
  );
};

// --- Main AppLauncher (unchanged – uses the improved Renderer) ---
export const AppLauncher = () => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/html-files')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch apps');
        return res.json();
      })
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span style={{ fontSize: '1.2rem', color: '#666' }}>Loading your apps...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <p>Error loading apps: {error}</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Make sure your API route is set up correctly.</p>
      </div>
    );
  }

  if (selectedApp) {
    return <RendererComponent filePath={selectedApp} onBack={() => setSelectedApp(null)} />;
  }

  // --- Home Screen (icon logic as before) ---
  return (
    <div style={{ padding: '40px 20px 20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '30px', color: '#1c1c1e', paddingLeft: '10px' }}>
        📱 My Apps
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '24px',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        {apps.map((app) => {
          const chars = Array.from(app.name);
          const firstChar = chars[0] || '📄';
          const isEmoji = !/^[a-zA-Z0-9_]$/.test(firstChar);
          const icon = firstChar;
          const displayName = isEmoji
            ? chars.slice(1).join('').trim() || app.name
            : app.name;

          return (
            <div
              key={app.path}
              onClick={() => setSelectedApp(app.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 10px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid rgba(255,255,255,0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '18px',
                  background: '#007aff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  color: 'white',
                  marginBottom: '12px',
                  boxShadow: '0 4px 8px rgba(0,122,255,0.3)',
                }}
              >
                {icon}
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1c1c1e',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  maxWidth: '100%',
                }}
              >
                {displayName}
              </span>
            </div>
          );
        })}
      </div>

      {apps.length === 0 && (
        <div style={{ textAlign: 'center', color: '#8e8e93', marginTop: '60px' }}>
          <p style={{ fontSize: '1.2rem' }}>📂 No HTML files found</p>
          <p style={{ fontSize: '0.9rem' }}>Add some <code>.html</code> files to your <code>public</code> folder.</p>
        </div>
      )}
    </div>
  );
};