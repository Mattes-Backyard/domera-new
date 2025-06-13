import React from "react";

/**
 * Standard error fallback component for content rendering errors
 */
export const ErrorFallback: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <div className="h-full overflow-auto p-6">
    <div className="text-center">
      <p className="text-red-600">Error loading content</p>
      {onBack && (
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go Back
        </button>
      )}
    </div>
  </div>
);

/**
 * General error fallback for view rendering errors
 */
export const ViewErrorFallback: React.FC = () => (
  <div className="h-full overflow-auto p-6">
    <div className="text-center">
      <p className="text-red-600">An error occurred while loading this view</p>
      <p className="text-gray-600 mt-2">Please try refreshing the page</p>
    </div>
  </div>
);

/**
 * Wrapper div with consistent scrolling for all views
 */
export const ViewContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full overflow-auto">
    {children}
  </div>
);