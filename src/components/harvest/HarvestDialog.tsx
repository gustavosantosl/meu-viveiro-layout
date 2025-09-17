import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CultivationCycle } from '@/hooks/useCultivationCycles';

const formSchema = z.object({
  peso_final_despesca: z.number().min(0.1, 'Peso final é obrigatório'),
  preco_venda_kg: z.number().min(0.01, 'Preço de venda é obrigatório'),
  custo_despesca: z.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface HarvestDialogProps {
  cycle: CultivationCycle;
  totalFeed: number;
  isOpen: boolean;
  onClose: () => void;
  onFinalize: (data: {
    cycleId: string;
    data_despesca: string;
    peso_final_despesca: number;
    preco_venda_kg: number;
    custo_despesca?: number;
    ganho_de_peso: number;
    fca_final: number;
    lucro_total: number;
  }) => void;
}

export const HarvestDialog = ({ 
  cycle, 
  totalFeed, 
  isOpen, 
  onClose, 
  onFinalize 
}: HarvestDialogProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      peso_final_despesca: 0,
      preco_venda_kg: 0,
      custo_despesca: 0,
    },
  });

  const onSubmit = (data: FormData) => {
    const pesoInicial = cycle.peso_inicial_total || 0;
    const ganho_de_peso = data.peso_final_despesca - pesoInicial;
    const fca_final = ganho_de_peso > 0 ? totalFeed / ganho_de_peso : 0;
    
    // Placeholder for feed cost calculation (R$ 5 per kg)
    const custoEstimadoRacao = totalFeed * 5;
    const receita = data.peso_final_despesca * data.preco_venda_kg;
    const custoTotal = (data.custo_despesca || 0) + custoEstimadoRacao;
    const lucro_total = receita - custoTotal;

    onFinalize({
      cycleId: cycle.id,
      data_despesca: new Date().toISOString().split('T')[0],
      peso_final_despesca: data.peso_final_despesca,
      preco_venda_kg: data.preco_venda_kg,
      custo_despesca: data.custo_despesca,
      ganho_de_peso,
      fca_final,
      lucro_total,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Ciclo - Dados da Despesca</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="peso_final_despesca">Peso Final da Despesca (kg)</Label>
            <Input
              id="peso_final_despesca"
              type="number"
              step="0.1"
              {...form.register('peso_final_despesca', { valueAsNumber: true })}
              placeholder="Ex: 1500"
            />
            {form.formState.errors.peso_final_despesca && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.peso_final_despesca.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="preco_venda_kg">Preço de Venda por kg (R$)</Label>
            <Input
              id="preco_venda_kg"
              type="number"
              step="0.01"
              {...form.register('preco_venda_kg', { valueAsNumber: true })}
              placeholder="Ex: 18.50"
            />
            {form.formState.errors.preco_venda_kg && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.preco_venda_kg.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="custo_despesca">Custo da Despesca (R$) - Opcional</Label>
            <Input
              id="custo_despesca"
              type="number"
              step="0.01"
              {...form.register('custo_despesca', { valueAsNumber: true })}
              placeholder="Ex: 200.00"
            />
            {form.formState.errors.custo_despesca && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.custo_despesca.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Finalizar Ciclo
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Resumo do Ciclo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Peso Inicial:</strong> {cycle.peso_inicial_total || 0} kg</p>
            <p><strong>Total de Ração Consumida:</strong> {totalFeed.toFixed(1)} kg</p>
            <p><strong>Custo Estimado da Ração:</strong> R$ {(totalFeed * 5).toFixed(2)}</p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};