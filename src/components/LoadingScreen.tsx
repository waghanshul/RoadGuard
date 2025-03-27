import React from 'react';
import { Shield } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
      <Shield className="w-16 h-16 text-primary-500 animate-pulse mb-4" />
      <h2 className="text-2xl font-bold text-secondary-800 mb-2">Loading RoadGuard</h2>
      <div className="w-48 h-2 bg-secondary-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}