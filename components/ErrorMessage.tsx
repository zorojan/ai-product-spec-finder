
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="w-full max-w-2xl bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg text-center" role="alert">
      <p className="font-semibold">An Error Occurred</p>
      <p>{message}</p>
    </div>
  );
};