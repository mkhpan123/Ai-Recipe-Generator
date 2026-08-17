import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  subMessage?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  subMessage 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-9 h-9 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
        <Loader2 className="w-4 h-4 text-indigo-600 absolute animate-pulse" />
      </div>
      <p className="text-xs font-semibold text-slate-800">{message}</p>
      {subMessage && (
        <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs">{subMessage}</p>
      )}
    </div>
  );
};
