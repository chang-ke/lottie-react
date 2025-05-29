"use client";

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Lottie React v3 Development Environment</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Welcome to the testing environment for lottie-react v3! This workspace allows you to
        compare and test the behavior between raw lottie-web and the lottie-react wrapper.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          border: '1px solid #28a745',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{ color: '#28a745', margin: '0 0 1rem 0' }}>🎬 Lottie Web (Raw)</h2>
          <p>
            Direct implementation using lottie-web library. This shows the baseline
            behavior and API that our React wrapper should match or improve upon.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Use this page to understand the raw lottie-web properties and behavior.
          </p>
        </div>
        
        <div style={{
          padding: '1.5rem',
          border: '1px solid #dc3545',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{ color: '#dc3545', margin: '0 0 1rem 0' }}>⚛️ Lottie React</h2>
          <p>
            Implementation using our lottie-react v3 library. This demonstrates
            the React-friendly API and optimizations we're building.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Use this page to test the React wrapper functionality and performance.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '4px'
      }}>
        <h3>v3 Development Goals:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>🌲 <strong>Tree-shaking support</strong> - Reduce bundle sizes</li>
          <li>⚡ <strong>Performance optimization</strong> - Faster rendering and lower memory usage</li>
          <li>📦 <strong>lottie-light support</strong> - Even smaller bundles for simple animations</li>
          <li>🔧 <strong>Improved API</strong> - Better developer experience</li>
          <li>🧪 <strong>Better testing</strong> - Comprehensive test coverage</li>
        </ul>
      </div>
    </div>
  );
}
