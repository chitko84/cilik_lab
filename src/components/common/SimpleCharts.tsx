/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface BarChartProps {
  data: { label: string; value: number; secondary?: number; color?: string }[];
  height?: number;
  valueSuffix?: string;
  maxValue?: number;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  height = 160,
  valueSuffix = '%',
  maxValue,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const computedMax = maxValue || Math.max(...data.map(d => Math.max(d.value, d.secondary || 0)), 100);

  return (
    <div className="w-full">
      <div className="flex items-end gap-3 w-full" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const heightPercent = Math.min(100, (item.value / computedMax) * 100);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-9 z-20 bg-slate-900 text-white text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap pointer-events-none">
                  <span className="font-medium">{item.label}:</span> {item.value}
                  {valueSuffix}
                </div>
              )}

              {/* Bar */}
              <div className="w-full max-w-[36px] bg-slate-100 rounded-t-md relative overflow-hidden flex items-end h-full">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    item.color || 'bg-amber-500 hover:bg-amber-600'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className="text-[11px] text-slate-500 mt-2 truncate w-full text-center font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LineChartProps {
  data: { day: string; minutes: number; exercisesCompleted: number }[];
  height?: number;
}

export const SimpleActivityLine: React.FC<LineChartProps> = ({ data, height = 140 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.minutes), 60);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.minutes / maxVal) * 80 - 10;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full relative" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[calc(100%-24px)] overflow-visible">
        <defs>
          <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />

        {/* Area */}
        <path d={areaD} fill="url(#activityGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredIdx === i ? 4 : 2.5}
            className={`transition-all ${hoveredIdx === i ? 'fill-sky-700 stroke-white stroke-2' : 'fill-sky-500'}`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute -top-7 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-0.5 rounded shadow pointer-events-none"
          style={{ left: `${(hoveredIdx / (data.length - 1)) * 100}%` }}
        >
          {data[hoveredIdx].minutes} mins · {data[hoveredIdx].exercisesCompleted} ex
        </div>
      )}

      {/* X Labels */}
      <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium px-1 mt-1">
        {data.map((d, i) => (
          <span key={i}>{d.day}</span>
        ))}
      </div>
    </div>
  );
};

interface DonutProps {
  segments: { label: string; count: number; color: string }[];
  size?: number;
}

export const SimpleDonutChart: React.FC<DonutProps> = ({ segments, size = 120 }) => {
  const total = segments.reduce((sum, s) => sum + s.count, 0) || 1;
  let accumulatedAngle = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const pct = (seg.count / total) * 100;
            const strokeDasharray = `${pct} ${100 - pct}`;
            const strokeDashoffset = -accumulatedAngle;
            accumulatedAngle += pct;

            return (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke={seg.color}
                strokeWidth="4.5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold text-slate-900">{total}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-tight">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-600 font-medium">{s.label}:</span>
            <span className="text-slate-900 font-semibold tabular-nums">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
