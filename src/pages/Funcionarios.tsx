import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Funcionario {
  id: string;
  nome_completo: string;
  funcao_cargo: string;
  salario_mensal: number;
  data_admissao: string;
  contato?: string;
  observacoes?: string;
}

interface FuncionarioForm {
  nome_completo: string;
  funcao_cargo: string;
  salario_mensal: number;
  data_admissao: string;
  contato?: string;
  observacoes?: string;
}

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FuncionarioForm>();

  const fetchFuncionarios = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os funcionários.",
      });
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, [user]);

  const onSubmit = async (data: FuncionarioForm) => {
    if (!user) return;

    setLoading(true);
    try {
      if (editingId) {
        // Atualizar funcionário existente
        const { error } = await supabase
          .from('funcionarios')
          .update({
            ...data,
            salario_mensal: Number(data.salario_mensal),
          })
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Funcionário atualizado com sucesso!",
        });
      } else {
        // Criar novo funcionário
        const { error } = await supabase
          .from('funcionarios')
          .insert({
            ...data,
            salario_mensal: Number(data.salario_mensal),
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Funcionário adicionado com sucesso!",
        });
      }

      reset();
      setEditingId(null);
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o funcionário.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingId(funcionario.id);
    setValue('nome_completo', funcionario.nome_completo);
    setValue('funcao_cargo', funcionario.funcao_cargo);
    setValue('salario_mensal', funcionario.salario_mensal);
    setValue('data_admissao', funcionario.data_admissao);
    setValue('contato', funcionario.contato || '');
    setValue('observacoes', funcionario.observacoes || '');
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Funcionário excluído com sucesso!",
      });
      
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o funcionário.",
      });
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Funcionários</h1>
        <p className="text-muted-foreground font-inter">Gestão de recursos humanos</p>
      </div>

      {/* Formulário */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Editar Funcionário' : 'Adicionar Funcionário'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  {...register('nome_completo', { required: 'Nome completo é obrigatório' })}
                  placeholder="Digite o nome completo"
                />
                {errors.nome_completo && (
                  <p className="text-sm text-destructive">{errors.nome_completo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="funcao_cargo">Função / Cargo *</Label>
                <Input
                  id="funcao_cargo"
                  {...register('funcao_cargo', { required: 'Função/cargo é obrigatório' })}
                  placeholder="Digite a função ou cargo"
                />
                {errors.funcao_cargo && (
                  <p className="text-sm text-destructive">{errors.funcao_cargo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salario_mensal">Salário Mensal (R$) *</Label>
                <Input
                  id="salario_mensal"
                  type="number"
                  step="0.01"
                  {...register('salario_mensal', { 
                    required: 'Salário mensal é obrigatório',
                    min: { value: 0, message: 'Salário deve ser maior que zero' }
                  })}
                  placeholder="0,00"
                />
                {errors.salario_mensal && (
                  <p className="text-sm text-destructive">{errors.salario_mensal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_admissao">Data de Admissão *</Label>
                <Input
                  id="data_admissao"
                  type="date"
                  {...register('data_admissao', { required: 'Data de admissão é obrigatória' })}
                />
                {errors.data_admissao && (
                  <p className="text-sm text-destructive">{errors.data_admissao.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contato">Contato</Label>
                <Input
                  id="contato"
                  {...register('contato')}
                  placeholder="Telefone ou email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                {...register('observacoes')}
                placeholder="Observações sobre o funcionário"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          {funcionarios.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum funcionário cadastrado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Salário</TableHead>
                    <TableHead>Data de Admissão</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionarios.map((funcionario) => (
                    <TableRow key={funcionario.id}>
                      <TableCell className="font-medium">
                        {funcionario.nome_completo}
                      </TableCell>
                      <TableCell>{funcionario.funcao_cargo}</TableCell>
                      <TableCell>{formatCurrency(funcionario.salario_mensal)}</TableCell>
                      <TableCell>{formatDate(funcionario.data_admissao)}</TableCell>
                      <TableCell>{funcionario.contato || '-'}</TableCell>
                      <TableCell>{funcionario.observacoes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(funcionario)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(funcionario.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Funcionarios;