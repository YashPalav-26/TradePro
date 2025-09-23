import CandlestickChart from "@/components/CandlestickChart";
import Header from "@/components/Header";

export default function CandlestickChartPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Advanced Charting</h1>
        <p className="text-muted-foreground mb-8">Analyze market trends with our powerful candlestick charts.</p>
        <div className="bg-card p-4 rounded-lg shadow-lg">
          <CandlestickChart />
        </div>
      </main>
    </div>
  );
}