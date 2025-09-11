import { useState, useEffect, useRef } from 'react';
import { TrafficSimulation } from '@/utils/trafficSimulation';
import { TrafficIntersection } from '@/components/TrafficIntersection';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { PerformanceChart } from '@/components/PerformanceChart';
import { LaneStatus } from '@/components/LaneStatus';
import { Header } from '@/components/Header';
import { PredictionModule } from '@/components/PredictionModule';
import { AlgorithmType, TrafficMetrics } from '@/types/traffic';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [simulation] = useState(() => new TrafficSimulation());
  const [vehicles, setVehicles] = useState(simulation.getVehicles());
  const [signals, setSignals] = useState(simulation.getSignals());
  const [metrics, setMetrics] = useState(simulation.getMetrics());
  const [lanes, setLanes] = useState(simulation.getLaneData());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('fixed');
  const [baselineMetrics, setBaselineMetrics] = useState<TrafficMetrics | undefined>();
  const [isRunning, setIsRunning] = useState(true);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      simulation.update();
      setVehicles([...simulation.getVehicles()]);
      setSignals(simulation.getSignals());
      setMetrics(simulation.getMetrics());
      setLanes(simulation.getLaneData());
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [simulation, isRunning]);

  useEffect(() => {
    // Store baseline metrics when switching from fixed algorithm
    if (selectedAlgorithm !== 'fixed' && !baselineMetrics) {
      setBaselineMetrics(metrics);
    }
  }, [selectedAlgorithm, metrics, baselineMetrics]);

  const handleAlgorithmChange = (algorithm: AlgorithmType) => {
    setSelectedAlgorithm(algorithm);
    simulation.setAlgorithm(algorithm);
    
    toast({
      title: "Algorithm Changed",
      description: `Switched to ${algorithm === 'fixed' ? 'Fixed-Time' : algorithm === 'max-pressure' ? 'Max-Pressure' : 'AI-Optimized'} control`,
    });

    // Reset baseline when switching to fixed
    if (algorithm === 'fixed') {
      setBaselineMetrics(undefined);
    }
  };

  const handleReset = () => {
    simulation.reset();
    setBaselineMetrics(undefined);
    toast({
      title: "Simulation Reset",
      description: "Traffic simulation has been reset to initial state",
    });
  };

  const handleToggleSimulation = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "Simulation Paused" : "Simulation Started",
      description: isRunning ? "Traffic simulation has been paused" : "Traffic simulation is now running",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onReset={handleReset}
        isRunning={isRunning}
        onToggleSimulation={handleToggleSimulation}
      />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Traffic Intersection Visualization */}
          <div className="lg:col-span-2">
            <div className="h-[500px] rounded-lg overflow-hidden shadow-card">
              <TrafficIntersection
                vehicles={vehicles}
                signals={signals}
                congestionLevel={metrics.congestionLevel}
              />
            </div>
          </div>
          
          {/* Prediction Module */}
          <div className="lg:col-span-1">
            <PredictionModule currentCongestion={metrics.congestionLevel} />
          </div>
        </div>

        {/* Metrics Display */}
        <div className="mb-6">
          <MetricsDisplay 
            metrics={metrics}
            comparisonMetrics={selectedAlgorithm !== 'fixed' ? baselineMetrics : undefined}
          />
        </div>

        {/* Algorithm Selector */}
        <div className="mb-6">
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={handleAlgorithmChange}
          />
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceChart
            currentAlgorithm={selectedAlgorithm}
            currentValue={metrics.averageWaitTime}
            metric="waitTime"
          />
          <PerformanceChart
            currentAlgorithm={selectedAlgorithm}
            currentValue={metrics.throughput}
            metric="throughput"
          />
        </div>

        {/* Lane Status */}
        <div className="mb-6">
          <LaneStatus lanes={lanes} />
        </div>
      </main>
    </div>
  );
};

export default Index;