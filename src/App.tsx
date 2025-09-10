import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/fazenda" element={
              <ProtectedRoute>
                <Layout>
                  <Fazenda />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cultivo" element={
              <ProtectedRoute>
                <Layout>
                  <Cultivo />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/estoque" element={
              <ProtectedRoute>
                <Layout>
                  <Estoque />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/coleta-dados" element={
              <ProtectedRoute>
                <Layout>
                  <ColetaDados />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/financeiro" element={
              <ProtectedRoute>
                <Layout>
                  <Financeiro />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/funcionarios" element={
              <ProtectedRoute>
                <Layout>
                  <Funcionarios />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <Layout>
                  <Relatorios />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
