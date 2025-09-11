import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import { useFarms, useUpdateFarm, useDeleteFarm, type ShrimpFarm } from "@/hooks/useFarms";
import { supabase } from "@/integrations/supabase/client";

const Fazenda = () => {
  const { data: farms, isLoading } = useFarms();
  const updateFarm = useUpdateFarm();
  const deleteFarm = useDeleteFarm();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<ShrimpFarm | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingFarm) {
      await updateFarm.mutateAsync({ ...editingFarm, ...formData });
      setIsDialogOpen(false);
      setEditingFarm(null);
      setFormData({ name: '', location: '' });
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("Usuário sendo enviado para o insert:", user);

    if (userError || !user) {
      alert("Você precisa estar logado para criar uma fazenda.");
      return;
    }

    // Garante que o perfil do usuário existe para não violar a FK (profiles -> shrimp_farms.user_id)
    const { data: existingProfile, error: profileSelectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileSelectError) {
      console.warn("Erro ao verificar perfil do usuário:", profileSelectError);
    }

    if (!existingProfile) {
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, name: (user.user_metadata as any)?.name ?? null, email: user.email ?? null }]);
      if (profileInsertError) {
        console.error("Erro ao criar perfil do usuário:", profileInsertError);
      }
    }

    const { error } = await supabase
      .from("shrimp_farms")
      .insert([{ name: formData.name, location: formData.location, user_id: user.id }]);

    if (error) {
      alert("Erro ao criar fazenda: " + error.message);
      console.error(error);
    } else {
      alert("Fazenda criada com sucesso!");
      setFormData({ name: '', location: '' });
      setIsDialogOpen(false);
      setEditingFarm(null);
      // Refresh the farms list
      window.location.reload();
    }
  };

  const handleEdit = (farm: ShrimpFarm) => {
    setEditingFarm(farm);
    setFormData({ name: farm.name, location: farm.location || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta fazenda?')) {
      await deleteFarm.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-foreground">Fazendas</h1>
          <p className="text-muted-foreground font-inter">Gerencie suas fazendas de camarão</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={16} />
              Nova Fazenda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFarm ? 'Editar Fazenda' : 'Nova Fazenda'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Fazenda</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingFarm ? 'Atualizar' : 'Criar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms?.map((farm) => (
          <Card key={farm.id} className="shadow-card">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{farm.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(farm)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(farm.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {farm.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{farm.location}</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                Criada em {new Date(farm.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {farms?.length === 0 && (
        <Card className="shadow-card text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Nenhuma fazenda cadastrada ainda.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              Criar primeira fazenda
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Fazenda;