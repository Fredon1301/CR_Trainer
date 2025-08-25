import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Cards from "@/pages/Cards";
import Training from "@/pages/Training";
import Admin from "@/pages/Admin";
import Clans from "@/pages/Clans";
import Tournaments from "@/pages/Tournaments";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/documentation" component={Documentation} />

      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/cards" component={Cards} />
          <Route path="/training" component={Training} />
          <Route path="/admin" component={Admin} />
          <Route path="/clans" component={Clans} />
          <Route path="/tournaments" component={Tournaments} />
        </>
      )}
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
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
