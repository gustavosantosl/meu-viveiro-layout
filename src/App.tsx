import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Fazenda from "./pages/Fazenda";
import Cultivo from "./pages/Cultivo";
import Estoque from "./pages/Estoque";
import ColetaDados from "./pages/ColetaDados";
import Financeiro from "./pages/Financeiro";
import Funcionarios from "./pages/Funcionarios";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/fazenda" element={<Fazenda />} />
            <Route path="/cultivo" element={<Cultivo />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/coleta-dados" element={<ColetaDados />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
