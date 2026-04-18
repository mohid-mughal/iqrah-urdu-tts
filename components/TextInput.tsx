import { ChangeEvent } from 'react';
import { transliterationService } from '@/services/transliteration.service';

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextInput({
  value,
  onChange,
  placeholder = 'یہاں اردو متن لکھیں یا Roman Urdu میں ٹائپ کریں...',
  disabled = false,
}: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    
    // Apply transliteration while preserving existing Urdu script
    const transliteratedText = transliterationService.safeRomanToUrdu(inputText);
    
    onChange(transliteratedText);
  };

  return (
    <div className="w-full">
      <label htmlFor="urdu-text-input" className="sr-only">
        Urdu text input - Type in Roman Urdu or paste Urdu script
      </label>
      <textarea
        id="urdu-text-input"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 
          font-urdu text-base sm:text-lg
          border-2 border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          resize-y
          urdu-text
          touch-manipulation
        `}
        dir="rtl"
        lang="ur"
        aria-label="Urdu text input - Type in Roman Urdu or paste Urdu script"
        aria-describedby="text-input-help"
      />
      <div id="text-input-help" className="mt-2 text-xs sm:text-sm text-gray-600">
        <p>
          Type in Roman Urdu and it will automatically convert to Urdu script, or paste Urdu text directly.
        </p>
      </div>
    </div>
  );
}
