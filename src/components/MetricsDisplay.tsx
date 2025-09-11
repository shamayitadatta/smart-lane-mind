import { TrafficMetrics } from '@/types/traffic';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, Users, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsDisplayProps {
  metrics: TrafficMetrics;
  comparisonMetrics?: TrafficMetrics;
}

export function MetricsDisplay({ metrics, comparisonMetrics }: MetricsDisplayProps) {
  const getImprovement = (current: number, baseline?: number) => {
    if (!baseline || baseline === 0) return 0;
    return ((baseline - current) / baseline) * 100;
  };

  const metricCards = [
    {
      title: 'Average Wait Time',
      value: `${metrics.averageWaitTime.toFixed(1)}s`,
      icon: Clock,
      improvement: comparisonMetrics ? getImprovement(metrics.averageWaitTime, comparisonMetrics.averageWaitTime) : 0,
      color: 'text-cyber'
    },
    {
      title: 'Queue Length',
      value: metrics.queueLength.toString(),
      icon: Users,
      improvement: comparisonMetrics ? getImprovement(metrics.queueLength, comparisonMetrics.queueLength) : 0,
      color: 'text-status-moderate'
    },
    {
      title: 'Throughput',
      value: metrics.throughput.toString(),
      icon: Activity,
      improvement: comparisonMetrics ? -getImprovement(metrics.throughput, comparisonMetrics.throughput) : 0,
      color: 'text-status-optimal',
      inverse: true
    },
    {
      title: 'Stop Count',
      value: metrics.stopCount.toString(),
      icon: Zap,
      improvement: comparisonMetrics ? getImprovement(metrics.stopCount, comparisonMetrics.stopCount) : 0,
      color: 'text-status-congested'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.inverse ? metric.improvement < 0 : metric.improvement > 0;
        
        return (
          <Card 
            key={index}
            className="relative overflow-hidden bg-gradient-to-br from-card to-secondary border-border/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber/5 to-transparent" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                <Icon className={cn("w-4 h-4", metric.color)} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                {comparisonMetrics && metric.improvement !== 0 && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    isPositive ? "text-status-optimal" : "text-status-congested"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(metric.improvement).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}