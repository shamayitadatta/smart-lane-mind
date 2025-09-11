import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlgorithmType } from '@/types/traffic';

interface PerformanceData {
  time: string;
  fixed: number;
  maxPressure: number;
  aiOptimized: number;
}

interface PerformanceChartProps {
  currentAlgorithm: AlgorithmType;
  currentValue: number;
  metric: 'waitTime' | 'throughput';
}

export function PerformanceChart({ currentAlgorithm, currentValue, metric }: PerformanceChartProps) {
  const [data, setData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const time = new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });

        // Simulate data for different algorithms
        const newPoint: PerformanceData = {
          time,
          fixed: metric === 'waitTime' ? 25 + Math.random() * 10 : 15 + Math.random() * 5,
          maxPressure: metric === 'waitTime' ? 18 + Math.random() * 8 : 20 + Math.random() * 5,
          aiOptimized: metric === 'waitTime' ? 12 + Math.random() * 6 : 25 + Math.random() * 5
        };

        // Override current algorithm with actual value
        if (currentAlgorithm === 'fixed') newPoint.fixed = currentValue;
        else if (currentAlgorithm === 'max-pressure') newPoint.maxPressure = currentValue;
        else if (currentAlgorithm === 'ai-optimized') newPoint.aiOptimized = currentValue;

        newData.push(newPoint);
        
        // Keep only last 20 points
        if (newData.length > 20) {
          newData.shift();
        }
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentAlgorithm, currentValue, metric]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary border-border/50">
      <h3 className="text-lg font-semibold mb-4">
        {metric === 'waitTime' ? 'Average Wait Time' : 'Throughput'} Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            label={{ 
              value: metric === 'waitTime' ? 'Wait Time (s)' : 'Vehicles/min',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="fixed" 
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            dot={false}
            name="Fixed-Time"
            strokeOpacity={currentAlgorithm === 'fixed' ? 1 : 0.4}
          />
          <Line 
            type="monotone" 
            dataKey="maxPressure" 
            stroke="hsl(var(--status-moderate))"
            strokeWidth={2}
            dot={false}
            name="Max-Pressure"
            strokeOpacity={currentAlgorithm === 'max-pressure' ? 1 : 0.4}
          />
          <Line 
            type="monotone" 
            dataKey="aiOptimized" 
            stroke="hsl(var(--cyber))"
            strokeWidth={2}
            dot={false}
            name="AI-Optimized"
            strokeOpacity={currentAlgorithm === 'ai-optimized' ? 1 : 0.4}
            filter={currentAlgorithm === 'ai-optimized' ? 'url(#glow)' : undefined}
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
