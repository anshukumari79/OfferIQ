import { Toaster } from "react-hot-toast";
import { TopBar } from "./components/TopBar";
import { OfferForm } from "./components/OfferForm";
import { ResultsPanel } from "./components/ResultsPanel";
import { EmptyState } from "./components/EmptyState";
import { useCalculateOffer } from "./hooks/useCalculateOffer";

export default function App() {
  const { result, isLoading, calculate } = useCalculateOffer();

  return (
    <div className="min-h-screen bg-zinc-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid #E4E4E7",
          },
        }}
      />

      <TopBar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-900">
            Offer calculator
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Enter your offer details to see your monthly take-home pay, tax
            comparison, and vesting timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <OfferForm onSubmit={calculate} isLoading={isLoading} />

          <div className="lg:sticky lg:top-10">
            {result ? <ResultsPanel result={result} /> : <EmptyState />}
          </div>
        </div>
      </main>
    </div>
  );
}
