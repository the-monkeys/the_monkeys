'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang='en'>
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#ffffff',
            color: '#151515',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <section
            role='alert'
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '40px 28px',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#ff574a',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Monkeys
            </p>
            <h1 style={{ margin: '14px 0 0', fontSize: '34px' }}>
              The application could not be loaded
            </h1>
            <p
              style={{ margin: '14px 0 0', color: '#6b7280', lineHeight: 1.6 }}
            >
              Refresh this page to try again. Your account and content are
              unaffected.
            </p>
            <button
              type='button'
              onClick={reset}
              style={{
                marginTop: '28px',
                padding: '12px 22px',
                border: 0,
                borderRadius: '999px',
                background: '#ff574a',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
