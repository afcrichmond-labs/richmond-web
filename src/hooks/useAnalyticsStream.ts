import { useEffect, useRef, useState } from "react";

interface AnalyticsData {
  revenue: number;
  revenueTrend: number;
  activeUsers: number;
  usersTrend: number;
  conversionRate: number;
  avgOrderValue: number;
  timeSeries: TimeSeriesPoint[];
}

export function useAnalyticsStream(dateRange: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://api.richmond.dev/analytics/stream?range=${dateRange.key}`
    );

    ws.onopen = () => setIsStreaming(true);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setData((prev) => ({ ...prev, ...update }));
    };
    ws.onerror = () => setError(new Error("Analytics stream failed"));
    ws.onclose = () => setIsStreaming(false);

    wsRef.current = ws;
    return () => ws.close();
  }, [dateRange]);

  return { data, isStreaming, error };
}
