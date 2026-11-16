'use client';

import { useState } from 'react';

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';

import '../customBlocks/CodeBlock/styles/prismjs.css';
import '../customBlocks/CodeBlock/styles/style.css';

export function ReaderCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [feedback, setFeedback] = useState('Copy');
  const grammar = Prism.languages[language];
  return (
    <div className='custom-code-wrapper'>
      <div className='select-wrapper'>
        <div className='language-label'>{language.toUpperCase()}</div>
      </div>
      <button
        type='button'
        className='code-copy-button'
        aria-label='Copy code to clipboard'
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setFeedback('Copied!');
          } catch {
            setFeedback('Error');
          }
        }}
      >
        <span className='copy-label'>{feedback}</span>
      </button>
      <pre>
        {grammar ? (
          <code
            className={`custom-code-editor language-${language}`}
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(code, grammar, language),
            }}
          />
        ) : (
          <code className={`custom-code-editor language-${language}`}>
            {code}
          </code>
        )}
      </pre>
    </div>
  );
}
