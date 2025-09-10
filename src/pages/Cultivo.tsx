import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShrimpIcon } from "@/components/icons/ShrimpIcon";
import { Plus, Edit, Trash2 } from "lucide-react";
import { usePonds, useCreatePond, useUpdatePond, useDeletePond, type Pond } from "@/hooks/usePonds";
import { useFarms } from "@/hooks/useFarms";

const Cultivo = () => {
  const { data: ponds, isLoading: pondsLoading } = usePonds();
  const { data: farms } = useFarms();
  const createPond = useCreatePond();
  const updatePond = useUpdatePond();
  const deletePond = useDeletePond();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPond, setEditingPond] = useState<Pond | null>(null);
  const [formData, setFormData] = useState({ name: '', farm_id: '', size: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      farm_id: formData.farm_id || null,
      size: formData.size ? parseFloat(formData.size) : null,
    };

    if (editingPond) {
      await updatePond.mutateAsync({ ...editingPond, ...data });
    } else {
      await createPond.mutateAsync(data);
    }
    
    setIsDialogOpen(false);
    setEditingPond(null);
    setFormData({ name: '', farm_id: '', size: '' });
  };

  const handleEdit = (pond: Pond) => {
    setEditingPond(pond);
    setFormData({ 
      name: pond.name, 
      farm_id: pond.farm_id || '', 
      size: pond.size?.toString() || '' 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tanque?')) {
      await deletePond.mutateAsync(id);
    }
  };

  if (pondsLoading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShrimpIcon className="text-primary" size={32} />
          <div>
            <h1 className="text-2xl font-poppins font-bold text-foreground">Cultivo</h1>
            <p className="text-muted-foreground font-inter">Gerencie seus tanques e ciclos de criação</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={16} />
              Novo Tanque
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPond ? 'Editar Tanque' : 'Novo Tanque'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Tanque</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="farm">Fazenda</Label>
                <Select 
                  value={formData.farm_id} 
                  onValueChange={(value) => setFormData({ ...formData, farm_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fazenda" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms?.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Tamanho (hectares)</Label>
                <Input
                  id="size"
                  type="number"
                  step="0.1"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingPond ? 'Atualizar' : 'Criar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ponds?.map((pond) => (
          <Card key={pond.id} className="shadow-card">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{pond.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(pond)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(pond.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pond.size && (
                <div className="text-lg font-semibold text-primary">
                  {pond.size} hectares
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                Criado em {new Date(pond.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ponds?.length === 0 && (
        <Card className="shadow-card text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Nenhum tanque cadastrado ainda.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              Criar primeiro tanque
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cultivo;