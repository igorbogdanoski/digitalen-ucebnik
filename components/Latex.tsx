import React, { useEffect, useState } from 'react';

// Declare katex on window since we are loading it from CDN
declare global {
  interface Window {
    katex: any;
  }
}

interface LatexProps {
  expression: string;
  className?: string;
  block?: boolean;
}

const Latex: React.FC<LatexProps> = ({ expression, className = '', block = false }) => {
  const [html, setHtml] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if KaTeX is already loaded
    if (window.katex) {
      setIsLoaded(true);
      return;
    }

    // Poll for KaTeX availability
    const interval = setInterval(() => {
      if (window.katex) {
        setIsLoaded(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.katex) {
      // Fallback while loading
      return;
    }

    try {
      const renderedHtml = window.katex.renderToString(expression, {
        throwOnError: false,
        displayMode: block,
        output: 'html', // Render html output
        strict: false
      });
      setHtml(renderedHtml);
    } catch (error) {
      console.error('KaTeX render error:', error);
      setHtml(`<span class="text-red-500 font-mono text-sm">${expression}</span>`);
    }
  }, [expression, block, isLoaded]);

  if (!isLoaded) {
    // While loading script, show raw text gently or skeleton
    return <span className={`opacity-50 ${className}`}>{expression}</span>;
  }

  return (
    <span 
      className={`${block ? 'block' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export default Latex;