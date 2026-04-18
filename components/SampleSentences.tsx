import { SampleSentence } from '@/types';

interface SampleSentencesProps {
  sentences: SampleSentence[];
  onSelect: (sentence: string) => void;
}

export default function SampleSentences({ sentences, onSelect }: SampleSentencesProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-pakistan-green mb-3 sm:mb-4" id="sample-sentences-heading">
        Sample Sentences
      </h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        role="list"
        aria-labelledby="sample-sentences-heading"
      >
        {sentences.map((sentence) => (
          <button
            key={sentence.id}
            onClick={() => onSelect(sentence.urdu)}
            className="
              group relative
              p-3 sm:p-4 
              bg-white 
              border-2 border-gray-200 
              rounded-lg 
              hover:border-pakistan-green 
              hover:shadow-lg
              transition-all duration-200
              text-left
              focus:outline-none 
              focus:ring-2 
              focus:ring-pakistan-green 
              focus:ring-offset-2
              touch-manipulation
              active:scale-98
            "
            aria-label={`Select sample sentence: ${sentence.roman}`}
            role="listitem"
          >
            {/* Decorative corner element - Islamic geometric pattern inspired */}
            <div className="absolute top-2 right-2 w-2 sm:w-3 h-2 sm:h-3 border-t-2 border-r-2 border-pakistan-lightGreen opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            <div className="absolute bottom-2 left-2 w-2 sm:w-3 h-2 sm:h-3 border-b-2 border-l-2 border-pakistan-lightGreen opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            
            {/* Urdu text */}
            <div className="urdu-text text-base sm:text-lg mb-2 text-gray-800 group-hover:text-pakistan-green transition-colors" lang="ur" dir="rtl">
              {sentence.urdu}
            </div>
            
            {/* Roman transliteration */}
            <div className="text-xs sm:text-sm text-gray-500 italic break-words">
              {sentence.roman}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
