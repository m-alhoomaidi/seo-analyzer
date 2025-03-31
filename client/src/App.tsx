import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Get the base URL from the current location
const baseUrl = import.meta.env.BASE_URL || '/';

function Router() {
  const [, setLocation] = useLocation();
  
  return (
    <Switch>
      <Route path={baseUrl} component={Home} />
      <Route path={`${baseUrl}*`} component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="overflow-x-hidden w-full max-w-[100vw]">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
