import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Fish, Waves, Utensils, AlertTriangle, Download } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertsTab } from '@/components/alerts/AlertsTab';
import { HarvestDialog } from '@/components/harvest/HarvestDialog';
import { getAlertBadgeColor } from '@/utils/exportUtils';
import {
  CultivationCycle,
  useBiometricData,
  useCreateBiometric,
  useWaterQuality,
  useCreateWaterQuality,
  useDailyFeeding,
  useCreateDailyFeeding,
  useFinalizarCiclo,
} from '@/hooks/useCultivationCycles';
import { useHealthRecords, useCreateHealthRecord } from '@/hooks/useHealthRecords';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CycleDetailsDialogProps {
  cycle: CultivationCycle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CycleDetailsDialog = ({ cycle, open, onOpenChange }: CycleDetailsDialogProps) => {
  const [harvestDialogOpen, setHarvestDialogOpen] = useState(false);
  const [biometricForm, setBiometricForm] = useState({
    data_coleta: format(new Date(), 'yyyy-MM-dd'),
    peso_medio_amostra: '',
    quantidade_amostra: '',
    biomassa_estimada: '',
    observacoes: '',
  });

  const [waterQualityForm, setWaterQualityForm] = useState({
    data_coleta: format(new Date(), 'yyyy-MM-dd'),
    ph: '',
    oxigenio_dissolvido: '',
    temperatura: '',
    salinidade: '',
    turbidez: '',
    alcalinidade: '',
    cor_agua: '',
    observacoes: '',
  });

  const [feedingForm, setFeedingForm] = useState({
    data_alimentacao: format(new Date(), 'yyyy-MM-dd'),
    quantidade_racao: '',
    tipo_racao: '',
    mortalidade_observada: '',
    observacoes: '',
    lote_racao: '',
    fornecedor: '',
  });

  const [healthForm, setHealthForm] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    sintomas: '',
    diagnostico: '',
    tratamento: '',
  });

  const { data: biometrics = [] } = useBiometricData(cycle?.id || '');
  const { data: waterQuality = [] } = useWaterQuality(cycle?.id || '');
  const { data: dailyFeeding = [] } = useDailyFeeding(cycle?.id || '');
  const { data: healthRecords = [] } = useHealthRecords(cycle?.id || '');

  const createBiometric = useCreateBiometric();
  const createWaterQuality = useCreateWaterQuality();
  const createDailyFeeding = useCreateDailyFeeding();
  const createHealthRecord = useCreateHealthRecord();
  const finalizarCiclo = useFinalizarCiclo();

  if (!cycle) return null;

  const diasCultivo = differenceInDays(new Date(), new Date(cycle.data_povoamento));
  const totalRacao = dailyFeeding.reduce((sum, feed) => sum + Number(feed.quantidade_racao), 0);
  const totalMortalidade = dailyFeeding.reduce((sum, feed) => sum + Number(feed.mortalidade_observada), 0);
  
  // Calcular FCA (estimado)
  const ultimaBiometria = biometrics[0];
  const pesoAtualEstimado = ultimaBiometria?.biomassa_estimada || 0;
  const pesoInicial = cycle.peso_inicial_total || 0;
  const ganhoResistente = pesoAtualEstimado - pesoInicial;
  const fca = ganhoResistente > 0 ? totalRacao / ganhoResistente : 0;

  const handleBiometricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cycle.id) return;

    createBiometric.mutate({
      cycle_id: cycle.id,
      data_coleta: biometricForm.data_coleta,
      peso_medio_amostra: Number(biometricForm.peso_medio_amostra),
      quantidade_amostra: biometricForm.quantidade_amostra ? Number(biometricForm.quantidade_amostra) : null,
      biomassa_estimada: biometricForm.biomassa_estimada ? Number(biometricForm.biomassa_estimada) : null,
      observacoes: biometricForm.observacoes || null,
    });

    setBiometricForm({
      data_coleta: format(new Date(), 'yyyy-MM-dd'),
      peso_medio_amostra: '',
      quantidade_amostra: '',
      biomassa_estimada: '',
      observacoes: '',
    });
  };

  const handleWaterQualitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cycle.id) return;

    createWaterQuality.mutate({
      cycle_id: cycle.id,
      data_coleta: waterQualityForm.data_coleta,
      ph: waterQualityForm.ph ? Number(waterQualityForm.ph) : null,
      oxigenio_dissolvido: waterQualityForm.oxigenio_dissolvido ? Number(waterQualityForm.oxigenio_dissolvido) : null,
      temperatura: waterQualityForm.temperatura ? Number(waterQualityForm.temperatura) : null,
      salinidade: waterQualityForm.salinidade ? Number(waterQualityForm.salinidade) : null,
      turbidez: waterQualityForm.turbidez ? Number(waterQualityForm.turbidez) : null,
      alcalinidade: waterQualityForm.alcalinidade ? Number(waterQualityForm.alcalinidade) : null,
      cor_agua: waterQualityForm.cor_agua || null,
      observacoes: waterQualityForm.observacoes || null,
    });

    setWaterQualityForm({
      data_coleta: format(new Date(), 'yyyy-MM-dd'),
      ph: '',
      oxigenio_dissolvido: '',
      temperatura: '',
      salinidade: '',
      turbidez: '',
      alcalinidade: '',
      cor_agua: '',
      observacoes: '',
    });
  };

  const handleFeedingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cycle.id) return;

    createDailyFeeding.mutate({
      cycle_id: cycle.id,
      data_alimentacao: feedingForm.data_alimentacao,
      quantidade_racao: Number(feedingForm.quantidade_racao),
      tipo_racao: feedingForm.tipo_racao || null,
      mortalidade_observada: Number(feedingForm.mortalidade_observada) || 0,
      observacoes: feedingForm.observacoes || null,
      lote_racao: feedingForm.lote_racao || null,
      fornecedor: feedingForm.fornecedor || null,
    });

    setFeedingForm({
      data_alimentacao: format(new Date(), 'yyyy-MM-dd'),
      quantidade_racao: '',
      tipo_racao: '',
      mortalidade_observada: '',
      observacoes: '',
      lote_racao: '',
      fornecedor: '',
    });
  };

  const handleHealthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cycle.id) return;

    createHealthRecord.mutate({
      ciclo_id: cycle.id,
      data: healthForm.data,
      sintomas: healthForm.sintomas || null,
      diagnostico: healthForm.diagnostico || null,
      tratamento: healthForm.tratamento || null,
    });

    setHealthForm({
      data: format(new Date(), 'yyyy-MM-dd'),
      sintomas: '',
      diagnostico: '',
      tratamento: '',
    });
  };

  // Preparar dados para análise preditiva
  const predictiveData = biometrics.map((bio, index) => ({
    dia: index * 7, // Assumindo biometrias semanais
    pesoAtual: bio.peso_medio_amostra,
    pesoHistorico: 5 + (index * 2), // Dados simulados - substituir por dados reais
  }));

  const alertBadgeVariant = getAlertBadgeColor(waterQuality || [], dailyFeeding || []);

  const handleFinalizeCycle = (harvestData: any) => {
    finalizarCiclo.mutate(harvestData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Fish className="h-5 w-5" />
                  {cycle.nome_ciclo}
                  <Badge variant={alertBadgeVariant}>
                    {alertBadgeVariant === 'destructive' ? 'Crítico' : 
                     alertBadgeVariant === 'secondary' ? 'Atenção' : 'Normal'}
                  </Badge>
                </DialogTitle>
              </div>
              {cycle.status === 'ativo' && (
                <Button 
                  onClick={() => setHarvestDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Finalizar Ciclo
                </Button>
              )}
            </div>
          </DialogHeader>

        {/* Indicadores principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Dias de Cultivo</p>
                  <p className="text-2xl font-bold">{diasCultivo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Ração (kg)</p>
                  <p className="text-2xl font-bold">{totalRacao.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">FCA Estimado</p>
                <p className="text-2xl font-bold">{fca > 0 ? fca.toFixed(2) : '--'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Mortalidade</p>
                <p className="text-2xl font-bold">{totalMortalidade}</p>
              </div>
            </CardContent>
          </Card>
        </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="biometrics">Biometria</TabsTrigger>
              <TabsTrigger value="water">Qualidade Água</TabsTrigger>
              <TabsTrigger value="feeding">Alimentação</TabsTrigger>
              <TabsTrigger value="health">Saúde</TabsTrigger>
              <TabsTrigger value="alerts">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Alertas
              </TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Ciclo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Data de Povoamento:</strong> {format(new Date(cycle.data_povoamento), 'dd/MM/yyyy', { locale: ptBR })}</p>
                <p><strong>Peso Inicial Total:</strong> {cycle.peso_inicial_total ? `${cycle.peso_inicial_total} kg` : '--'}</p>
                <p><strong>Status:</strong> {cycle.status}</p>
                {cycle.observacoes && <p><strong>Observações:</strong> {cycle.observacoes}</p>}
              </CardContent>
            </Card>

            {ultimaBiometria && (
              <Card>
                <CardHeader>
                  <CardTitle>Última Biometria</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Data:</strong> {format(new Date(ultimaBiometria.data_coleta), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p><strong>Peso Médio:</strong> {ultimaBiometria.peso_medio_amostra}g</p>
                  {ultimaBiometria.biomassa_estimada && (
                    <p><strong>Biomassa Estimada:</strong> {ultimaBiometria.biomassa_estimada} kg</p>
                  )}
                </CardContent>
              </Card>
            )}

            {predictiveData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Análise Preditiva</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={predictiveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" label={{ value: 'Dias de Cultivo', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Peso Médio (g)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="pesoAtual" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        name="Linha atual"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pesoHistorico" 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Linha média histórica"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-2">
                    A curva azul mostra o crescimento atual comparado à média histórica.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="biometrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nova Biometria</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBiometricSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_coleta">Data da Coleta</Label>
                      <Input
                        id="data_coleta"
                        type="date"
                        value={biometricForm.data_coleta}
                        onChange={(e) => setBiometricForm({ ...biometricForm, data_coleta: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="peso_medio">Peso Médio da Amostra (g)</Label>
                      <Input
                        id="peso_medio"
                        type="number"
                        step="0.1"
                        value={biometricForm.peso_medio_amostra}
                        onChange={(e) => setBiometricForm({ ...biometricForm, peso_medio_amostra: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantidade_amostra">Quantidade da Amostra</Label>
                      <Input
                        id="quantidade_amostra"
                        type="number"
                        value={biometricForm.quantidade_amostra}
                        onChange={(e) => setBiometricForm({ ...biometricForm, quantidade_amostra: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="biomassa_estimada">Biomassa Estimada (kg)</Label>
                      <Input
                        id="biomassa_estimada"
                        type="number"
                        step="0.1"
                        value={biometricForm.biomassa_estimada}
                        onChange={(e) => setBiometricForm({ ...biometricForm, biomassa_estimada: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio_observacoes">Observações</Label>
                    <Textarea
                      id="bio_observacoes"
                      value={biometricForm.observacoes}
                      onChange={(e) => setBiometricForm({ ...biometricForm, observacoes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={createBiometric.isPending}>
                    {createBiometric.isPending ? 'Salvando...' : 'Salvar Biometria'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Biometrias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {biometrics.map((bio) => (
                    <div key={bio.id} className="border p-3 rounded">
                      <p><strong>{format(new Date(bio.data_coleta), 'dd/MM/yyyy', { locale: ptBR })}</strong></p>
                      <p>Peso médio: {bio.peso_medio_amostra}g</p>
                      {bio.biomassa_estimada && <p>Biomassa: {bio.biomassa_estimada}kg</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Qualidade da Água</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWaterQualitySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="data_coleta_water">Data da Coleta</Label>
                    <Input
                      id="data_coleta_water"
                      type="date"
                      value={waterQualityForm.data_coleta}
                      onChange={(e) => setWaterQualityForm({ ...waterQualityForm, data_coleta: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ph">pH</Label>
                      <Input
                        id="ph"
                        type="number"
                        step="0.1"
                        value={waterQualityForm.ph}
                        onChange={(e) => setWaterQualityForm({ ...waterQualityForm, ph: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="oxigenio">Oxigênio Dissolvido</Label>
                      <Input
                        id="oxigenio"
                        type="number"
                        step="0.1"
                        value={waterQualityForm.oxigenio_dissolvido}
                        onChange={(e) => setWaterQualityForm({ ...waterQualityForm, oxigenio_dissolvido: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperatura">Temperatura (°C)</Label>
                      <Input
                        id="temperatura"
                        type="number"
                        step="0.1"
                        value={waterQualityForm.temperatura}
                        onChange={(e) => setWaterQualityForm({ ...waterQualityForm, temperatura: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salinidade">Salinidade</Label>
                      <Input
                        id="salinidade"
                        type="number"
                        step="0.1"
                        value={waterQualityForm.salinidade}
                        onChange={(e) => setWaterQualityForm({ ...waterQualityForm, salinidade: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="turbidez">Turbidez</Label>
                      <Input
                        id="turbidez"
                        type="number"
                        step="0.1"
                        value={waterQualityForm.turbidez}
                        onChange={(e) => setWaterQualityForm({ ...waterQualityForm, turbidez: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="alcalinidade">Alcalinidade</Label>
                      <Input
                        id="alcalinidade"
                        type="number"
                        step="0.1"
                        value={waterQualityForm.alcalinidade}
                        onChange={(e) => setWaterQualityForm({ ...waterQualityForm, alcalinidade: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cor_agua">Cor da Água</Label>
                    <Input
                      id="cor_agua"
                      value={waterQualityForm.cor_agua}
                      onChange={(e) => setWaterQualityForm({ ...waterQualityForm, cor_agua: e.target.value })}
                      placeholder="Ex: Verde, marrom, transparente..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="water_observacoes">Observações</Label>
                    <Textarea
                      id="water_observacoes"
                      value={waterQualityForm.observacoes}
                      onChange={(e) => setWaterQualityForm({ ...waterQualityForm, observacoes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={createWaterQuality.isPending}>
                    {createWaterQuality.isPending ? 'Salvando...' : 'Salvar Qualidade da Água'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Qualidade da Água</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {waterQuality.map((water) => (
                    <div key={water.id} className="border p-3 rounded">
                      <p><strong>{format(new Date(water.data_coleta), 'dd/MM/yyyy', { locale: ptBR })}</strong></p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {water.ph && <p>pH: {water.ph}</p>}
                        {water.oxigenio_dissolvido && <p>O₂: {water.oxigenio_dissolvido}</p>}
                        {water.temperatura && <p>Temp: {water.temperatura}°C</p>}
                        {water.salinidade && <p>Salinidade: {water.salinidade}</p>}
                        {water.cor_agua && <p>Cor: {water.cor_agua}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feeding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Alimentação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data_alimentacao">Data da Alimentação</Label>
                      <Input
                        id="data_alimentacao"
                        type="date"
                        value={feedingForm.data_alimentacao}
                        onChange={(e) => setFeedingForm({ ...feedingForm, data_alimentacao: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantidade_racao">Quantidade de Ração (kg)</Label>
                      <Input
                        id="quantidade_racao"
                        type="number"
                        step="0.1"
                        value={feedingForm.quantidade_racao}
                        onChange={(e) => setFeedingForm({ ...feedingForm, quantidade_racao: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipo_racao">Tipo de Ração</Label>
                      <Input
                        id="tipo_racao"
                        value={feedingForm.tipo_racao}
                        onChange={(e) => setFeedingForm({ ...feedingForm, tipo_racao: e.target.value })}
                        placeholder="Ex: Crescimento, Engorda..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="mortalidade">Mortalidade Observada</Label>
                      <Input
                        id="mortalidade"
                        type="number"
                        value={feedingForm.mortalidade_observada}
                        onChange={(e) => setFeedingForm({ ...feedingForm, mortalidade_observada: e.target.value })}
                        placeholder="Número de camarões mortos"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lote_racao">Lote da Ração</Label>
                      <Input
                        id="lote_racao"
                        value={feedingForm.lote_racao}
                        onChange={(e) => setFeedingForm({ ...feedingForm, lote_racao: e.target.value })}
                        placeholder="Ex: L2024001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fornecedor">Fornecedor</Label>
                      <Input
                        id="fornecedor"
                        value={feedingForm.fornecedor}
                        onChange={(e) => setFeedingForm({ ...feedingForm, fornecedor: e.target.value })}
                        placeholder="Ex: Ração SA"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feeding_observacoes">Observações</Label>
                    <Textarea
                      id="feeding_observacoes"
                      value={feedingForm.observacoes}
                      onChange={(e) => setFeedingForm({ ...feedingForm, observacoes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={createDailyFeeding.isPending}>
                    {createDailyFeeding.isPending ? 'Salvando...' : 'Salvar Alimentação'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alimentação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dailyFeeding.map((feed) => (
                    <div key={feed.id} className="border p-3 rounded">
                      <p><strong>{format(new Date(feed.data_alimentacao), 'dd/MM/yyyy', { locale: ptBR })}</strong></p>
                      <p>Ração: {feed.quantidade_racao}kg</p>
                      {feed.tipo_racao && <p>Tipo: {feed.tipo_racao}</p>}
                      {feed.lote_racao && <p>Lote: {feed.lote_racao}</p>}
                      {feed.fornecedor && <p>Fornecedor: {feed.fornecedor}</p>}
                      {feed.mortalidade_observada > 0 && <p>Mortalidade: {feed.mortalidade_observada}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Ocorrência de Saúde</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHealthSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="health_data">Data</Label>
                    <Input
                      id="health_data"
                      type="date"
                      value={healthForm.data}
                      onChange={(e) => setHealthForm({ ...healthForm, data: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sintomas">Sintomas Observados</Label>
                    <Textarea
                      id="sintomas"
                      value={healthForm.sintomas}
                      onChange={(e) => setHealthForm({ ...healthForm, sintomas: e.target.value })}
                      placeholder="Descreva os sintomas observados..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="diagnostico">Diagnóstico</Label>
                    <Textarea
                      id="diagnostico"
                      value={healthForm.diagnostico}
                      onChange={(e) => setHealthForm({ ...healthForm, diagnostico: e.target.value })}
                      placeholder="Diagnóstico ou suspeita..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tratamento">Tratamento</Label>
                    <Textarea
                      id="tratamento"
                      value={healthForm.tratamento}
                      onChange={(e) => setHealthForm({ ...healthForm, tratamento: e.target.value })}
                      placeholder="Tratamento aplicado..."
                    />
                  </div>

                  <Button type="submit" disabled={createHealthRecord.isPending}>
                    {createHealthRecord.isPending ? 'Salvando...' : 'Salvar Registro de Saúde'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Saúde</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="border p-3 rounded">
                      <p><strong>{format(new Date(record.data), 'dd/MM/yyyy', { locale: ptBR })}</strong></p>
                      {record.sintomas && <p><strong>Sintomas:</strong> {record.sintomas}</p>}
                      {record.diagnostico && <p><strong>Diagnóstico:</strong> {record.diagnostico}</p>}
                      {record.tratamento && <p><strong>Tratamento:</strong> {record.tratamento}</p>}
                    </div>
                  ))}
                  {healthRecords.length === 0 && (
                    <p className="text-muted-foreground">Nenhum registro de saúde encontrado.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsTab 
              waterQuality={waterQuality || []}
              dailyFeeding={dailyFeeding || []}
            />
          </TabsContent>
        </Tabs>
        </DialogContent>
      </Dialog>

      <HarvestDialog
        open={harvestDialogOpen}
        onOpenChange={setHarvestDialogOpen}
        cycle={cycle}
        onFinalize={handleFinalizeCycle}
      />
    </>
  );
};