import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Fish, DollarSign, Calendar } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CultivationCycle } from "@/hooks/useCultivationCycles";

const formSchema = z.object({
  data_despesca: z.date({
    required_error: "Data da despesca é obrigatória",
  }),
  peso_final_despesca: z.number({
    required_error: "Peso final é obrigatório",
  }).min(0.1, "Peso deve ser maior que 0"),
  preco_venda_kg: z.number({
    required_error: "Preço de venda é obrigatório",
  }).min(0.01, "Preço deve ser maior que 0"),
});

interface HarvestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle: CultivationCycle;
  onFinalize: (data: {
    cycleId: string;
    data_despesca: string;
    peso_final_despesca: number;
    preco_venda_kg: number;
  }) => void;
}

export function HarvestDialog({ open, onOpenChange, cycle, onFinalize }: HarvestDialogProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_despesca: new Date(),
      peso_final_despesca: 0,
      preco_venda_kg: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      cycleId: cycle.id,
      data_despesca: values.data_despesca.toISOString().split('T')[0],
      peso_final_despesca: values.peso_final_despesca,
      preco_venda_kg: values.preco_venda_kg,
    };

    // Calculate summary data
    const diasCultivo = Math.ceil(
      (values.data_despesca.getTime() - new Date(cycle.data_povoamento).getTime()) / (1000 * 60 * 60 * 24)
    );
    const receitaTotal = values.peso_final_despesca * values.preco_venda_kg;
    const pesoInicial = cycle.peso_inicial_total || 0;
    const crescimento = values.peso_final_despesca - pesoInicial;

    setSummaryData({
      ...data,
      diasCultivo,
      receitaTotal,
      pesoInicial,
      crescimento,
    });
    
    setShowSummary(true);
  };

  const handleConfirmFinalize = () => {
    if (summaryData) {
      onFinalize(summaryData);
      setShowSummary(false);
      onOpenChange(false);
      form.reset();
    }
  };

  if (showSummary && summaryData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5" />
              Resumo da Despesca
            </DialogTitle>
            <DialogDescription>
              Confirme os dados do ciclo finalizado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Informações do Ciclo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ciclo:</span>
                  <span className="text-sm font-medium">{cycle.nome_ciclo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dias de cultivo:</span>
                  <span className="text-sm font-medium">{summaryData.diasCultivo} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Peso inicial:</span>
                  <span className="text-sm font-medium">{summaryData.pesoInicial.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Peso final:</span>
                  <span className="text-sm font-medium">{summaryData.peso_final_despesca.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Crescimento:</span>
                  <span className="text-sm font-medium text-green-600">
                    +{summaryData.crescimento.toFixed(2)} kg
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Resultado Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Preço por kg:</span>
                  <span className="text-sm font-medium">
                    R$ {summaryData.preco_venda_kg.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Receita total:</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ {summaryData.receitaTotal.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSummary(false)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirmFinalize}
                className="flex-1"
              >
                Confirmar Despesca
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Finalizar Ciclo - {cycle.nome_ciclo}
          </DialogTitle>
          <DialogDescription>
            Registre os dados da despesca para finalizar o ciclo de cultivo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="data_despesca"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Despesca</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(cycle.data_povoamento) || date > new Date()
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="peso_final_despesca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso Final da Despesca (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preco_venda_kg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Venda por kg (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Calcular Resumo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}