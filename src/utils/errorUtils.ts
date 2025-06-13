import React from "react";

/**
 * Safe error handling wrapper for rendering functions
 */
export const withErrorHandling = <T extends unknown[]>(
  renderFn: (...args: T) => React.ReactElement,
  fallback: React.ReactElement
) => {
  return (...args: T): React.ReactElement => {
    try {
      return renderFn(...args);
    } catch (error) {
      console.error('Error in render function:', error);
      return fallback;
    }
  };
};