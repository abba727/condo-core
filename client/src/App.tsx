/**
 * CondoCore style reminder: Quiet Brutalist Enterprise. Preserve the fixed command rail,
 * operational data density, warm stone/slate palette, monospaced ledgers, compact status
 * pills, and restrained construction-document texture across every route.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DbBridgeProviders } from "./components/DbBridgeProviders";
import CondoCore from "./pages/CondoCore.jsx";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <DbBridgeProviders>
            <CondoCore />
          </DbBridgeProviders>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
