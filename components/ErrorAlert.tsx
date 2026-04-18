'use client';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorAlert component for displaying inline error messages
 * Used for contextual errors within the application flow
 */
export default function ErrorAlert({
  message,
  title = 'Error',
  onDismiss,
  className = '',
}: ErrorAlertProps) {
  return (
    <div
      className={`p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-r ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-800 mb-1">{title}</h3>
          <p className="text-sm text-red-700 break-words">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded flex-shrink-0"
            aria-label="Dismiss error message"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
