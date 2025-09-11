import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionModuleProps {
  currentCongestion: 'low' | 'medium' | 'high';
}

export function PredictionModule({ currentCongestion }: PredictionModuleProps) {
  const [predictions, setPredictions] = useState<number[]>([]);

  useEffect(() => {
    // Generate predictions for next 5 minutes
    const generatePredictions = () => {
      const baseLine = currentCongestion === 'high' ? 80 : 
                       currentCongestion === 'medium' ? 50 : 20;
      
      const newPredictions = Array.from({ length: 5 }, (_, i) => {
        const trend = Math.sin((Date.now() / 10000) + i) * 20;
        const noise = Math.random() * 10 - 5;
        return Math.max(0, Math.min(100, baseLine + trend + noise));
      });
      
      setPredictions(newPredictions);
    };

    generatePredictions();
    const interval = setInterval(generatePredictions, 5000);
    return () => clearInterval(interval);
  }, [currentCongestion]);

  const getPredictionLevel = (value: number) => {
    if (value > 70) return { level: 'High', color: 'text-status-congested' };
    if (value > 40) return { level: 'Medium', color: 'text-status-moderate' };
    return { level: 'Low', color: 'text-status-optimal' };
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Traffic Prediction</h3>
        <TrendingUp className="w-5 h-5 text-cyber" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Next 5 minutes forecast</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {predictions.map((value, index) => {
            const { level, color } = getPredictionLevel(value);
            return (
              <div
                key={index}
                className="text-center p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  +{index + 1} min
                </div>
                <div className="relative h-16 bg-muted rounded overflow-hidden mb-2">
                  <div
                    className={cn(
                      "absolute bottom-0 w-full transition-all duration-500",
                      value > 70 ? "bg-status-congested/80" :
                      value > 40 ? "bg-status-moderate/80" :
                      "bg-status-optimal/80"
                    )}
                    style={{ height: `${value}%` }}
                  />
                </div>
                <div className={cn("text-xs font-medium", color)}>
                  {level}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-medium text-cyber">
              {(85 + Math.random() * 10).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}