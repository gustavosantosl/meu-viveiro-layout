import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Fish, Calendar, TrendingUp } from "lucide-react";
import { usePonds, Pond } from "@/hooks/usePonds";
import { useFarms } from "@/hooks/useFarms";
import { useCultivationCycles, useCreateCultivationCycle, CultivationCycle } from "@/hooks/useCultivationCycles";
import { CycleDetailsDialog } from "@/components/pond/CycleDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const Cultivo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<CultivationCycle | null>(null);
  const [isCycleDialogOpen, setIsCycleDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome_ciclo: "",
    pond_id: "",
    data_povoamento: format(new Date(), 'yyyy-MM-dd'),
    biomassa_inicial: "",
    peso_inicial_total: "",
    observacoes: "",
  });

  const { data: ponds } = usePonds();
  const { data: farms = [] } = useFarms();
  const { data: cycles = [] } = useCultivationCycles();
  const createCycle = useCreateCultivationCycle();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cycleData = {
      nome_ciclo: formData.nome_ciclo,
      pond_id: formData.pond_id,
      data_povoamento: formData.data_povoamento,
      biomassa_inicial: formData.biomassa_inicial ? Number(formData.biomassa_inicial) : null,
      peso_inicial_total: formData.peso_inicial_total ? Number(formData.peso_inicial_total) : null,
      data_inicio: new Date().toISOString(),
      data_fim: null,
      status: 'ativo' as const,
      observacoes: formData.observacoes || null,
      data_despesca: null,
      peso_final_despesca: null,
      preco_venda_kg: null,
      receita_total: null,
      fca_final: null,
      sobrevivencia_final: null,
    };

    createCycle.mutate(cycleData);
    setFormData({
      nome_ciclo: "",
      pond_id: "",
      data_povoamento: format(new Date(), 'yyyy-MM-dd'),
      biomassa_inicial: "",
      peso_inicial_total: "",
      observacoes: "",
    });
    setIsDialogOpen(false);
  };

  const handleCycleClick = (cycle: CultivationCycle) => {
    setSelectedCycle(cycle);
    setIsCycleDialogOpen(true);
  };

  const getPondName = (pondId: string) => {
    const pond = ponds?.find(p => p.id === pondId);
    return pond?.name || 'Tanque desconhecido';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Viveiros</h1>
          <p className="text-muted-foreground">
            Gerencie seus ciclos de cultivo de camarão
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Ciclo de Cultivo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Ciclo de Cultivo</DialogTitle>
              <DialogDescription>
                Inicie um novo ciclo de cultivo em um dos seus viveiros
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome_ciclo">Nome do Ciclo</Label>
                <Input
                  id="nome_ciclo"
                  value={formData.nome_ciclo}
                  onChange={(e) => setFormData({ ...formData, nome_ciclo: e.target.value })}
                  placeholder="Ex: Ciclo 1 - Viveiro 1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="pond">Viveiro</Label>
                <Select value={formData.pond_id} onValueChange={(value) => setFormData({ ...formData, pond_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um viveiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {ponds?.map((pond) => (
                      <SelectItem key={pond.id} value={pond.id}>
                        {pond.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_povoamento">Data de Povoamento</Label>
                <Input
                  id="data_povoamento"
                  type="date"
                  value={formData.data_povoamento}
                  onChange={(e) => setFormData({ ...formData, data_povoamento: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="biomassa_inicial">Biomassa Inicial (kg)</Label>
                  <Input
                    id="biomassa_inicial"
                    type="number"
                    step="0.1"
                    value={formData.biomassa_inicial}
                    onChange={(e) => setFormData({ ...formData, biomassa_inicial: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="peso_inicial_total">Peso Inicial Total (kg)</Label>
                  <Input
                    id="peso_inicial_total"
                    type="number"
                    step="0.1"
                    value={formData.peso_inicial_total}
                    onChange={(e) => setFormData({ ...formData, peso_inicial_total: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações sobre o povoamento..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createCycle.isPending}>
                  {createCycle.isPending ? "Criando..." : "Criar Ciclo"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {cycles && cycles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cycles.map((cycle) => {
            const diasCultivo = differenceInDays(new Date(), new Date(cycle.data_povoamento));
            
            return (
              <Card 
                key={cycle.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCycleClick(cycle)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Fish className="h-5 w-5" />
                      {cycle.nome_ciclo}
                    </CardTitle>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      cycle.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cycle.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getPondName(cycle.pond_id)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{diasCultivo} dias de cultivo</p>
                        <p className="text-xs text-muted-foreground">
                          Povoado em {format(new Date(cycle.data_povoamento), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    {cycle.peso_inicial_total && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Peso inicial: {cycle.peso_inicial_total} kg</p>
                        </div>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum ciclo de cultivo encontrado</CardTitle>
            <CardDescription>
              Comece criando seu primeiro ciclo de cultivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Ciclo
            </Button>
          </CardContent>
        </Card>
      )}

      <CycleDetailsDialog 
        cycle={selectedCycle}
        open={isCycleDialogOpen}
        onOpenChange={setIsCycleDialogOpen}
      />
    </div>
  );
};

export default Cultivo;