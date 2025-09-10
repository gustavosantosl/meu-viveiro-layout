import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Fish } from "lucide-react";
import { useFeedings, useCreateFeeding, useUpdateFeeding, useDeleteFeeding, type Feeding } from "@/hooks/useFeedings";
import { usePonds } from "@/hooks/usePonds";

const ColetaDados = () => {
  const { data: feedings, isLoading: feedingsLoading } = useFeedings();
  const { data: ponds } = usePonds();
  const createFeeding = useCreateFeeding();
  const updateFeeding = useUpdateFeeding();
  const deleteFeeding = useDeleteFeeding();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeeding, setEditingFeeding] = useState<Feeding | null>(null);
  const [formData, setFormData] = useState({ 
    pond_id: '', 
    feed_type: '', 
    quantity: '', 
    fed_at: new Date().toISOString().slice(0, 16) 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      pond_id: formData.pond_id || null,
      feed_type: formData.feed_type || null,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      fed_at: formData.fed_at,
    };

    if (editingFeeding) {
      await updateFeeding.mutateAsync({ ...editingFeeding, ...data });
    } else {
      await createFeeding.mutateAsync(data);
    }
    
    setIsDialogOpen(false);
    setEditingFeeding(null);
    setFormData({ pond_id: '', feed_type: '', quantity: '', fed_at: new Date().toISOString().slice(0, 16) });
  };

  const handleEdit = (feeding: Feeding) => {
    setEditingFeeding(feeding);
    setFormData({ 
      pond_id: feeding.pond_id || '', 
      feed_type: feeding.feed_type || '', 
      quantity: feeding.quantity?.toString() || '',
      fed_at: new Date(feeding.fed_at).toISOString().slice(0, 16)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro de alimentação?')) {
      await deleteFeeding.mutateAsync(id);
    }
  };

  if (feedingsLoading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-foreground">Coleta de Dados</h1>
          <p className="text-muted-foreground font-inter">Registre alimentações e monitore os dados</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={16} />
              Nova Alimentação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFeeding ? 'Editar Alimentação' : 'Nova Alimentação'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pond">Tanque</Label>
                <Select 
                  value={formData.pond_id} 
                  onValueChange={(value) => setFormData({ ...formData, pond_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tanque" />
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
                <Label htmlFor="feed_type">Tipo de Ração</Label>
                <Select 
                  value={formData.feed_type} 
                  onValueChange={(value) => setFormData({ ...formData, feed_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de ração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inicial">Inicial</SelectItem>
                    <SelectItem value="crescimento">Crescimento</SelectItem>
                    <SelectItem value="engorda">Engorda</SelectItem>
                    <SelectItem value="finalização">Finalização</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fed_at">Data e Hora</Label>
                <Input
                  id="fed_at"
                  type="datetime-local"
                  value={formData.fed_at}
                  onChange={(e) => setFormData({ ...formData, fed_at: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingFeeding ? 'Atualizar' : 'Registrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {feedings?.map((feeding) => {
          const pond = ponds?.find(p => p.id === feeding.pond_id);
          return (
            <Card key={feeding.id} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Fish className="text-primary" size={20} />
                    <span>Alimentação - {pond?.name || 'Tanque não encontrado'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(feeding)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(feeding.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Tipo de Ração:</span>
                    <div className="font-medium">{feeding.feed_type || 'Não informado'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Quantidade:</span>
                    <div className="font-medium">{feeding.quantity ? `${feeding.quantity} kg` : 'Não informado'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Data/Hora:</span>
                    <div className="font-medium">
                      {new Date(feeding.fed_at).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {feedings?.length === 0 && (
        <Card className="shadow-card text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Nenhuma alimentação registrada ainda.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              Registrar primeira alimentação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColetaDados;