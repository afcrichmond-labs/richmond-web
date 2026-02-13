import dynamic from "next/dynamic";

// Dynamic imports for heavy chart components
// Saves ~180KB from initial bundle
export const AreaChart = dynamic(
  () => import("@richmond/design-system").then((mod) => mod.AreaChart),
  { loading: () => <ChartSkeleton />, ssr: false }
);

export const BarChart = dynamic(
  () => import("@richmond/design-system").then((mod) => mod.BarChart),
  { loading: () => <ChartSkeleton />, ssr: false }
);

function ChartSkeleton() {
  return (
    <div className="chart-skeleton" role="progressbar" aria-label="Loading chart">
      <div className="chart-skeleton__bar" />
      <div className="chart-skeleton__bar chart-skeleton__bar--short" />
      <div className="chart-skeleton__bar chart-skeleton__bar--medium" />
    </div>
  );
}
