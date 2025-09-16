import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCultivationCycles, useBiometricData, useDailyFeeding, useWaterQuality } from "@/hooks/useCultivationCycles";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Activity, Droplets, Fish, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { CycleDetailsDialog } from "@/components/pond/CycleDetailsDialog";

const StatusIcon = ({ status }: { status: 'normal' | 'atenção' | 'crítico' }) => {
  switch (status) {
    case 'normal':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'atenção':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'crítico':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
};

const getCycleStatus = (waterQuality: any[], feedingData: any[], biometrics: any[]) => {
  // Get latest water quality
  const latestWater = waterQuality[0];
  
  if (latestWater?.oxigenio_dissolvido && latestWater.oxigenio_dissolvido < 3) {
    return 'crítico';
  }

  // Calculate FCA
  const totalFeed = feedingData.reduce((sum, feeding) => sum + feeding.quantidade_racao, 0);
  const latestBiometric = biometrics[0];
  const firstBiometric = biometrics[biometrics.length - 1];
  
  if (latestBiometric && firstBiometric && totalFeed > 0) {
    const biomassGain = latestBiometric.biomassa_estimada - firstBiometric.biomassa_estimada;
    const fca = biomassGain > 0 ? totalFeed / biomassGain : 0;
    
    if (fca > 2.0) {
      return 'atenção';
    }
  }

  return 'normal';
};

const calculateFCA = (feedingData: any[], biometrics: any[]) => {
  const totalFeed = feedingData.reduce((sum, feeding) => sum + feeding.quantidade_racao, 0);
  const latestBiometric = biometrics[0];
  const firstBiometric = biometrics[biometrics.length - 1];
  
  if (latestBiometric && firstBiometric && totalFeed > 0) {
    const biomassGain = latestBiometric.biomassa_estimada - firstBiometric.biomassa_estimada;
    return biomassGain > 0 ? (totalFeed / biomassGain).toFixed(2) : '0.00';
  }
  
  return '0.00';
};

const CycleCard = ({ cycle }: { cycle: any }) => {
  const [selectedCycle, setSelectedCycle] = useState<any>(null);
  const { data: biometrics = [] } = useBiometricData(cycle.id);
  const { data: feedingData = [] } = useDailyFeeding(cycle.id);
  const { data: waterQuality = [] } = useWaterQuality(cycle.id);

  const cultivationDays = differenceInDays(new Date(), new Date(cycle.data_povoamento));
  const latestBiometric = biometrics[0];
  const estimatedBiomass = latestBiometric?.biomassa_estimada || cycle.biomassa_inicial || 0;
  const fca = calculateFCA(feedingData, biometrics);
  const status = getCycleStatus(waterQuality, feedingData, biometrics);
  const totalFeed = feedingData.reduce((sum, feeding) => sum + feeding.quantidade_racao, 0);

  // Mini chart data for trends
  const chartData = biometrics.slice(-7).reverse().map((bio, index) => ({
    day: `Dia ${index + 1}`,
    peso: bio.peso_medio_amostra,
    biomassa: bio.biomassa_estimada
  }));

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCycle(cycle)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{cycle.nome_ciclo}</CardTitle>
            <StatusIcon status={status} />
          </div>
          <CardDescription>
            Povoado em {format(new Date(cycle.data_povoamento), "dd/MM/yyyy", { locale: ptBR })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dias de Cultivo</span>
              </div>
              <p className="text-2xl font-bold">{cultivationDays}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Fish className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Biomassa Est.</span>
              </div>
              <p className="text-2xl font-bold">{estimatedBiomass.toFixed(1)} kg</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">FCA Atual</span>
              </div>
              <p className="text-xl font-bold">{fca}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Ração Total</span>
              </div>
              <p className="text-xl font-bold">{totalFeed.toFixed(1)} kg</p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <Badge variant={status === 'normal' ? 'default' : status === 'atenção' ? 'secondary' : 'destructive'}>
            {status === 'normal' ? 'Normal' : status === 'atenção' ? 'Atenção' : 'Crítico'}
          </Badge>
        </CardContent>
      </Card>

      {selectedCycle && (
        <CycleDetailsDialog
          cycle={selectedCycle}
          open={!!selectedCycle}
          onOpenChange={(open) => !open && setSelectedCycle(null)}
        />
      )}
    </>
  );
};

export default function Index() {
  const { data: cycles = [], isLoading } = useCultivationCycles();
  const activeCycles = cycles.filter(cycle => cycle.status === 'ativo');

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Cultivo</h1>
        <p className="text-muted-foreground">
          Acompanhe seus ciclos de cultivo ativos em tempo real
        </p>
      </div>

      {activeCycles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Fish className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum ciclo ativo</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Você não possui nenhum ciclo de cultivo ativo no momento. Crie um novo ciclo para começar o monitoramento.
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/cultivo'}>
              Criar Novo Ciclo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCycles.map((cycle) => (
            <CycleCard key={cycle.id} cycle={cycle} />
          ))}
        </div>
      )}
    </div>
  );
}
