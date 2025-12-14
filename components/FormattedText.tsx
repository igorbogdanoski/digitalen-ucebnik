import React from 'react';
import MathFraction from './MathFraction';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  // Regex to identify mixed numbers (e.g., "3 1/2") or simple fractions (e.g., "1/4")
  // Group 1: Whole number (optional)
  // Group 2: Numerator
  // Group 3: Denominator
  const regex = /(?:(\d+)\s+)?(\d+)\/(\d+)|([=+\-×÷≠<>])/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    if (match[4]) {
        // It's a math operator
        parts.push(
            <span key={`op-${match.index}`} className="font-math-num mx-1 font-medium">
                {match[4]}
            </span>
        )
    } else {
        // It's a fraction
        const whole = match[1];
        const num = match[2];
        const den = match[3];

        parts.push(
          <MathFraction
            key={`frac-${match.index}`}
            numerator={num}
            denominator={den}
            whole={whole}
            size="md"
            className="align-middle"
          />
        );
    }

    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return <span className={`text-gray-800 leading-loose ${className}`}>{parts}</span>;
};

export default FormattedText;