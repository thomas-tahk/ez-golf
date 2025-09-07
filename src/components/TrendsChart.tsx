import type { TrendData } from '../types';
import { formatScoreToPar } from '../utils/scoreUtils';

interface TrendsChartProps {
  data: TrendData[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trends</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Not enough data to show trends. Play more rounds to see your progress!</p>
        </div>
      </div>
    );
  }

  const maxScore = Math.max(...data.map(d => d.scoreToPar));
  const minScore = Math.min(...data.map(d => d.scoreToPar));
  const range = Math.max(maxScore - minScore, 10); // Minimum range of 10
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 40;

  const getY = (scoreToPar: number) => {
    return chartHeight - ((scoreToPar - minScore) / range) * (chartHeight - 2 * padding) - padding;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
  };

  const pathData = data
    .map((d, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(d.scoreToPar)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trends</h3>
      
      <div className="mb-4">
        <svg width={chartWidth} height={chartHeight} className="border border-gray-200 rounded">
          {/* Grid lines */}
          {[-10, -5, 0, 5, 10, 15, 20].map(score => {
            if (score < minScore - 2 || score > maxScore + 2) return null;
            const y = getY(score);
            return (
              <g key={score}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke={score === 0 ? "#374151" : "#e5e7eb"}
                  strokeWidth={score === 0 ? 2 : 1}
                  strokeDasharray={score === 0 ? "none" : "3,3"}
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {formatScoreToPar(score)}
                </text>
              </g>
            );
          })}
          
          {/* Trend line */}
          <path
            d={pathData}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((d, index) => {
            const x = getX(index);
            const y = getY(d.scoreToPar);
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#059669"
                  stroke="white"
                  strokeWidth="2"
                />
                <title>
                  {new Date(d.date).toLocaleDateString()}: {formatScoreToPar(d.scoreToPar)}
                </title>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">
            {formatScoreToPar(data[data.length - 1].scoreToPar)}
          </div>
          <div className="text-sm text-gray-500">Latest Round</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {formatScoreToPar(Math.round(data.reduce((sum, d) => sum + d.scoreToPar, 0) / data.length))}
          </div>
          <div className="text-sm text-gray-500">Average</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {formatScoreToPar(Math.min(...data.map(d => d.scoreToPar)))}
          </div>
          <div className="text-sm text-gray-500">Best Round</div>
        </div>
      </div>
    </div>
  );
}