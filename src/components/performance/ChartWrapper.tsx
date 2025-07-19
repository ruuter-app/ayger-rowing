import React, { useMemo, useEffect, useState } from 'react';

interface ChartWrapperProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

// React 19 compatibility wrapper for Recharts
export function ChartWrapper({ children, width = "100%", height = "100%" }: ChartWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const memoizedChildren = useMemo(() => {
    if (!mounted) return null;
    return children;
  }, [children, mounted]);

  if (!mounted) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded"
      >
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <div style={{ width, height }}>
      {memoizedChildren}
    </div>
  );
} 