import { AreaChart, DateRangePicker } from "@richmond/design-system";
import { useAnalyticsStream } from "../../hooks/useAnalyticsStream";
import { useFeatureFlag } from "../../hooks/useFeatureFlag";

interface AnalyticsPanelProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function AnalyticsPanel({ dateRange, onDateRangeChange }: AnalyticsPanelProps) {
  const { data, isStreaming, error } = useAnalyticsStream(dateRange);

  if (error) {
    return <ErrorState message="Failed to load analytics" retry />;
  }

  return (
    <div className="analytics-panel">
      <div className="analytics-panel__header">
        <h2>Analytics Overview</h2>
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          presets={["7d", "30d", "90d"]}
        />
        {isStreaming && <StreamingIndicator />}
      </div>

      <div className="analytics-panel__grid">
        <MetricCard title="Revenue" value={data.revenue} trend={data.revenueTrend} />
        <MetricCard title="Active Users" value={data.activeUsers} trend={data.usersTrend} />
        <MetricCard title="Conversion Rate" value={data.conversionRate} format="percent" />
        <MetricCard title="Avg Order Value" value={data.avgOrderValue} format="currency" />
      </div>

      <AreaChart
        data={data.timeSeries}
        variant="stacked"
        height={320}
        responsive
      />
    </div>
  );
}
