import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, CalendarIcon, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FinanceRecord {
  id: string;
  data: string;
  categoria: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao?: string;
  criado_em: string;
  user_id: string;
}

const Financeiro = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);
  const [formData, setFormData] = useState({
    categoria: "",
    tipo: "" as 'entrada' | 'saida' | "",
    valor: "",
    descricao: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('financeiro')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar registros: " + error.message,
        variant: "destructive"
      });
    } else {
      setRecords((data || []) as FinanceRecord[]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !formData.categoria || !formData.tipo || !formData.valor) {
      toast({
        title: "Erro",
        description: "Campos obrigatórios: Data, Categoria, Tipo e Valor",
        variant: "destructive"
      });
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar registros",
        variant: "destructive"
      });
      return;
    }

    // Ensure user profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert([{ 
          id: user.id, 
          name: (user.user_metadata as any)?.name ?? null, 
          email: user.email ?? null 
        }]);
      if (profileInsertError) {
        console.error("Erro ao criar perfil do usuário:", profileInsertError);
      }
    }

    try {
      const recordData = {
        data: format(selectedDate, 'yyyy-MM-dd'),
        categoria: formData.categoria,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        descricao: formData.descricao || null,
        user_id: user.id
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('financeiro')
          .update(recordData)
          .eq('id', editingRecord.id);

        if (error) {
          toast({
            title: "Erro",
            description: "Erro ao atualizar registro: " + error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sucesso",
            description: "Registro atualizado com sucesso!"
          });
          fetchRecords();
          resetForm();
        }
      } else {
        const { error } = await supabase
          .from('financeiro')
          .insert([recordData]);

        if (error) {
          toast({
            title: "Erro",
            description: "Erro ao criar registro: " + error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sucesso",
            description: "Registro criado com sucesso!"
          });
          fetchRecords();
          resetForm();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar registro",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (record: FinanceRecord) => {
    setEditingRecord(record);
    setFormData({
      categoria: record.categoria,
      tipo: record.tipo,
      valor: record.valor.toString(),
      descricao: record.descricao || ""
    });
    setSelectedDate(new Date(record.data));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este registro?")) {
      return;
    }

    const { error } = await supabase
      .from('financeiro')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir registro: " + error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso!"
      });
      fetchRecords();
    }
  };

  const resetForm = () => {
    setFormData({ categoria: "", tipo: "" as any, valor: "", descricao: "" });
    setSelectedDate(undefined);
    setEditingRecord(null);
  };

  const calculateBalance = () => {
    const entradas = records
      .filter(record => record.tipo === 'entrada')
      .reduce((sum, record) => sum + record.valor, 0);

    const saidas = records
      .filter(record => record.tipo === 'saida')
      .reduce((sum, record) => sum + record.valor, 0);

    return entradas - saidas;
  };

  const balance = calculateBalance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground font-inter">Controle financeiro do seu negócio</p>
      </div>

      {/* Formulário */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {editingRecord ? "Editar Registro" : "Novo Registro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy", { locale: pt })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={pt}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ex: Vendas, Ração, Combustível"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value: 'entrada' | 'saida') => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do registro (opcional)"
                rows={3}
              />
            </div>

            <div className="flex gap-2 md:col-span-2">
              {editingRecord && (
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {editingRecord ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Saldo Atual */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {balance >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span className="text-lg font-semibold">Saldo Atual:</span>
            </div>
            <span className={cn(
              "text-2xl font-bold",
              balance >= 0 ? "text-green-600" : "text-red-600"
            )}>
              R$ {balance.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Registros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Registros Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
              <p className="text-muted-foreground">
                Comece adicionando o primeiro registro financeiro
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.data), "dd/MM/yyyy", { locale: pt })}
                    </TableCell>
                    <TableCell>{record.categoria}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        record.tipo === 'entrada' 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      )}>
                        {record.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "font-semibold",
                      record.tipo === 'entrada' ? "text-green-600" : "text-red-600"
                    )}>
                      R$ {record.valor.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell>{record.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(record)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(record.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;