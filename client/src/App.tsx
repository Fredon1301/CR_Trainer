import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./hooks/useLanguage";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { queryClient } from "./lib/queryClient";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Cards from "@/pages/Cards";
import Training from "@/pages/Training";
import Admin from "@/pages/Admin";
import Clans from "@/pages/Clans";
import Tournaments from "@/pages/Tournaments";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/cards" component={Cards} />
      <Route path="/training" component={Training} />

      <Route path="/clans" component={Clans} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/documentation" component={Documentation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <SpeedInsights />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;