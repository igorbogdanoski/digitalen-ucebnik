import React, { useEffect, useState } from 'react';

interface FractionInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  disabled?: boolean;
  status?: 'correct' | 'incorrect' | 'neutral';
}

const FractionInput: React.FC<FractionInputProps> = ({ 
  value, 
  onChange, 
  onEnter,
  disabled = false,
  status = 'neutral'
}) => {
  // Internal state for the three fields
  const [whole, setWhole] = useState('');
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');

  // Sync internal state with external value string "W N/D" or "N/D"
  useEffect(() => {
    if (!value) {
      setWhole('');
      setNum('');
      setDen('');
      return;
    }

    // Parse the string value back to fields
    // Formats: "1 1/2" or "3/4" or "5"
    if (value.includes('/')) {
        const parts = value.split(' ');
        if (parts.length > 1) {
            setWhole(parts[0]);
            const frac = parts[1].split('/');
            setNum(frac[0]);
            setDen(frac[1]);
        } else {
            setWhole('');
            const frac = parts[0].split('/');
            setNum(frac[0]);
            setDen(frac[1]);
        }
    } else {
        // Just a whole number input into this field, though unusual for this component
        setWhole(value);
    }
  }, [value]);

  const updateParent = (w: string, n: string, d: string) => {
    let result = '';
    const cleanW = w.trim();
    const cleanN = n.trim();
    const cleanD = d.trim();

    if (cleanN && cleanD) {
        if (cleanW) {
            result = `${cleanW} ${cleanN}/${cleanD}`;
        } else {
            result = `${cleanN}/${cleanD}`;
        }
    } else if (cleanW) {
        result = cleanW;
    }
    
    onChange(result);
  };

  const handleWholeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWhole(val);
    updateParent(val, num, den);
  };

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNum(val);
    updateParent(whole, val, den);
  };

  const handleDenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDen(val);
    updateParent(whole, num, val);
  };

  // Styles based on status
  const baseInputStyles = "text-center font-math-num font-bold outline-none transition-all placeholder-gray-300";
  let borderStyle = "border-gray-300 focus:border-indigo-500 bg-white";
  
  if (status === 'correct') {
      borderStyle = "border-green-500 bg-green-50 text-green-900";
  } else if (status === 'incorrect') {
      borderStyle = "border-red-400 bg-red-50 text-red-900";
  } else {
      borderStyle = "border-gray-300 focus:border-indigo-500 focus:bg-white bg-white focus:ring-2 focus:ring-indigo-500/20";
  }

  return (
    <div className={`inline-flex items-center gap-2 p-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 ${disabled ? 'opacity-80' : ''}`}>
      {/* Whole Number Input */}
      <input
        type="text"
        inputMode="numeric"
        value={whole}
        onChange={handleWholeChange}
        onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        disabled={disabled}
        placeholder="цел"
        className={`w-12 h-14 rounded-md border-2 text-xl ${baseInputStyles} ${borderStyle}`}
      />

      {/* Fraction Stack */}
      <div className="flex flex-col gap-1 items-center">
        {/* Numerator */}
        <input
            type="text"
            inputMode="numeric"
            value={num}
            onChange={handleNumChange}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
            disabled={disabled}
            placeholder="бр"
            className={`w-12 h-10 rounded-md border-2 text-lg ${baseInputStyles} ${borderStyle}`}
        />
        
        {/* Fraction Line */}
        <div className="w-full h-0.5 bg-gray-800 rounded-full"></div>
        
        {/* Denominator */}
        <input
            type="text"
            inputMode="numeric"
            value={den}
            onChange={handleDenChange}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
            disabled={disabled}
            placeholder="им"
            className={`w-12 h-10 rounded-md border-2 text-lg ${baseInputStyles} ${borderStyle}`}
        />
      </div>
    </div>
  );
};

export default FractionInput;
