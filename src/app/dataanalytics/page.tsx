import DataAnalyticsDashboard from "@/components/DataAnalyticsDashboard";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Data Analytics</h1>
        <p className="text-muted-foreground mb-8">Gain insights from your trading data.</p>
        <div className="bg-card p-4 rounded-lg shadow-lg">
          <DataAnalyticsDashboard />
        </div>
      </main>
    </div>
  );
}