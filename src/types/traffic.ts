export interface Vehicle {
  id: string;
  lane: number;
  position: number;
  speed: number;
  waitTime: number;
}

export interface TrafficSignal {
  north: 'red' | 'yellow' | 'green';
  south: 'red' | 'yellow' | 'green';
  east: 'red' | 'yellow' | 'green';
  west: 'red' | 'yellow' | 'green';
}

export interface TrafficMetrics {
  averageWaitTime: number;
  queueLength: number;
  throughput: number;
  stopCount: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface LaneData {
  direction: 'north' | 'south' | 'east' | 'west';
  vehicleCount: number;
  queueLength: number;
  averageSpeed: number;
  pressure: number;
}

export type AlgorithmType = 'fixed' | 'max-pressure' | 'ai-optimized';

export interface PredictionData {
  timestamp: Date;
  predictedArrival: number;
  confidence: number;
}