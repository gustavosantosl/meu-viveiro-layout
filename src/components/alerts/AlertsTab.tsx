import { AlertTriangle, Activity, Droplets, Fish } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WaterQuality, DailyFeeding } from "@/hooks/useCultivationCycles";

interface Alert {
  id: string;
  type: 'critical' | 'warning';
  message: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AlertsTabProps {
  waterQuality: WaterQuality[];
  dailyFeeding: DailyFeeding[];
}

export function AlertsTab({ waterQuality, dailyFeeding }: AlertsTabProps) {
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    // Check water quality alerts
    waterQuality.forEach((wq) => {
      if (wq.oxigenio_dissolvido && wq.oxigenio_dissolvido < 3) {
        alerts.push({
          id: `oxygen-${wq.id}`,
          type: 'critical',
          message: `Oxigênio dissolvido crítico: ${wq.oxigenio_dissolvido} mg/L`,
          timestamp: wq.data_coleta,
          icon: Droplets,
        });
      }

      if (wq.ph && (wq.ph < 6.5 || wq.ph > 9.0)) {
        alerts.push({
          id: `ph-${wq.id}`,
          type: 'warning',
          message: `pH fora do ideal: ${wq.ph}`,
          timestamp: wq.data_coleta,
          icon: Activity,
        });
      }
    });

    // Check feeding alerts (FCA calculation would need more complex logic)
    const totalRacao = dailyFeeding.reduce((sum, feed) => sum + (feed.quantidade_racao || 0), 0);
    if (totalRacao > 0) {
      // Simplified FCA check - would need actual biomass data for accurate calculation
      const avgMortalidade = dailyFeeding.reduce((sum, feed) => sum + (feed.mortalidade_observada || 0), 0) / dailyFeeding.length;
      
      if (avgMortalidade > 5) {
        alerts.push({
          id: 'mortality-high',
          type: 'critical',
          message: `Mortalidade média alta: ${avgMortalidade.toFixed(1)}%`,
          timestamp: new Date().toISOString(),
          icon: Fish,
        });
      }
    }

    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const alerts = generateAlerts();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Alertas Ativos</h3>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum alerta ativo no momento</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.type === 'critical' ? 'border-l-red-500' : 'border-l-yellow-500'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <alert.icon className={`h-4 w-4 ${
                      alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <CardTitle className="text-sm">{alert.message}</CardTitle>
                  </div>
                  <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.type === 'critical' ? 'Crítico' : 'Atenção'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}