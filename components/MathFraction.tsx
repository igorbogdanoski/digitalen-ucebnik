import React from 'react';

interface MathFractionProps {
  numerator: string | number;
  denominator: string | number;
  whole?: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MathFraction: React.FC<MathFractionProps> = ({ 
  numerator, 
  denominator, 
  whole, 
  size = 'md',
  className = '' 
}) => {
  // Size mappings
  const sizeClasses = {
    sm: { text: 'text-xs', padding: 'px-0.5', margin: 'mx-0.5' },
    md: { text: 'text-lg', padding: 'px-1', margin: 'mx-1' }, // Increased base size for better readability
    lg: { text: 'text-2xl', padding: 'px-2', margin: 'mx-1.5' },
    xl: { text: 'text-3xl', padding: 'px-2', margin: 'mx-2' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center align-middle font-math-num text-gray-900 ${currentSize.margin} ${className}`}>
      {whole && (
        <span className={`mr-1 font-semibold ${currentSize.text} leading-none`}>
          {whole}
        </span>
      )}
      <div className="flex flex-col items-center leading-none justify-center h-full">
        <span className={`${currentSize.text} ${currentSize.padding} border-b-2 border-gray-900 pb-[1px] mb-[1px] text-center w-full block`}>
          {numerator}
        </span>
        <span className={`${currentSize.text} ${currentSize.padding} text-center w-full block`}>
          {denominator}
        </span>
      </div>
    </div>
  );
};

export default MathFraction;