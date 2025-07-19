import React from 'react';

interface DataPoint {
  x: string | number;
  y: number;
  label?: string;
}

interface NativeChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  type?: 'line' | 'bar';
  color?: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export function NativeChart({
  data,
  width = 400,
  height = 300,
  type = 'line',
  color = '#2563eb',
  title,
  xLabel,
  yLabel
}: NativeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center border border-gray-200 rounded bg-gray-50"
        style={{ width, height }}
      >
        <span className="text-gray-500">No data available</span>
      </div>
    );
  }

  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const yRange = maxY - minY || 1;
  
  const scaleY = (value: number) => {
    return chartHeight - ((value - minY) / yRange) * chartHeight;
  };

  const scaleX = (index: number) => {
    return (index / (data.length - 1 || 1)) * chartWidth;
  };

  // Create path for line chart
  const createPath = () => {
    if (data.length === 0) return '';
    
    let path = `M ${scaleX(0)} ${scaleY(data[0].y)}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${scaleX(i)} ${scaleY(data[i].y)}`;
    }
    return path;
  };

  // Create bars for bar chart
  const createBars = () => {
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.1;

    return data.map((point, index) => {
      const x = (index / data.length) * chartWidth + barSpacing;
      const barHeight = ((point.y - minY) / yRange) * chartHeight;
      const y = chartHeight - barHeight;

      return (
        <rect
          key={index}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={color}
          opacity={0.8}
        >
          <title>{`${point.x}: ${point.y}`}</title>
        </rect>
      );
    });
  };

  // Create Y-axis ticks
  const yTicks = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const value = minY + (yRange * i) / tickCount;
    const y = scaleY(value);
    yTicks.push(
      <g key={i}>
        <line
          x1={-5}
          y1={y}
          x2={0}
          y2={y}
          stroke="#666"
          strokeWidth={1}
        />
        <text
          x={-10}
          y={y + 4}
          textAnchor="end"
          fontSize="12"
          fill="#666"
        >
          {Math.round(value)}
        </text>
      </g>
    );
  }

  // Create X-axis ticks
  const xTicks = data.map((point, index) => {
    const x = scaleX(index);
    return (
      <g key={index}>
        <line
          x1={x}
          y1={chartHeight}
          x2={x}
          y2={chartHeight + 5}
          stroke="#666"
          strokeWidth={1}
        />
        <text
          x={x}
          y={chartHeight + 20}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          {point.x}
        </text>
      </g>
    );
  });

  return (
    <div className="border border-gray-200 rounded p-4 bg-white">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yTicks.map((_, i) => {
            const y = scaleY(minY + (yRange * i) / tickCount);
            return (
              <line
                key={`grid-${i}`}
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            );
          })}

          {/* Chart content */}
          {type === 'line' ? (
            <path
              d={createPath()}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
          ) : (
            createBars()
          )}

          {/* Data points for line chart */}
          {type === 'line' && data.map((point, index) => (
            <circle
              key={index}
              cx={scaleX(index)}
              cy={scaleY(point.y)}
              r={4}
              fill={color}
            >
              <title>{`${point.x}: ${point.y}`}</title>
            </circle>
          ))}

          {/* Axes */}
          <line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#333"
            strokeWidth={2}
          />
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={chartHeight}
            stroke="#333"
            strokeWidth={2}
          />

          {/* Ticks */}
          {yTicks}
          {xTicks}

          {/* Labels */}
          {yLabel && (
            <text
              x={-40}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="14"
              fill="#333"
              transform={`rotate(-90, -40, ${chartHeight / 2})`}
            >
              {yLabel}
            </text>
          )}
          {xLabel && (
            <text
              x={chartWidth / 2}
              y={chartHeight + 35}
              textAnchor="middle"
              fontSize="14"
              fill="#333"
            >
              {xLabel}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
} 