import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { usePonds, useCreatePond, useUpdatePond, useDeletePond, Pond } from "@/hooks/usePonds";
import { useFarms } from "@/hooks/useFarms";
import { ViveiroDetalhes } from "@/components/pond/ViveiroDetalhes";
import { useToast } from "@/hooks/use-toast";

const Cultivo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPond, setSelectedPond] = useState<Pond | null>(null);
  const [editingPond, setEditingPond] = useState<Pond | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    farm_id: "",
  });

  const { data: ponds = [] } = usePonds();
  const { data: farms = [] } = useFarms();
  const createPond = useCreatePond();
  const updatePond = useUpdatePond();
  const deletePond = useDeletePond();
  const { toast } = useToast();

  // Group ponds by farm
  const pondsByFarm = ponds.reduce((acc, pond) => {
    const farmId = pond.farm_id || 'sem-fazenda';
    if (!acc[farmId]) {
      acc[farmId] = [];
    }
    acc[farmId].push(pond);
    return acc;
  }, {} as Record<string, Pond[]>);

  const getFarmName = (farmId: string) => {
    if (farmId === 'sem-fazenda') return 'Sem Fazenda';
    const farm = farms.find(f => f.id === farmId);
    return farm?.name || 'Fazenda desconhecida';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pondData = {
      name: formData.name,
      size: formData.size ? Number(formData.size) : null,
      farm_id: formData.farm_id || null,
    };

    if (editingPond) {
      updatePond.mutate({ id: editingPond.id, ...pondData });
    } else {
      createPond.mutate(pondData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      size: "",
      farm_id: "",
    });
    setIsDialogOpen(false);
    setEditingPond(null);
  };

  const handleEdit = (pond: Pond) => {
    setEditingPond(pond);
    setFormData({
      name: pond.name,
      size: pond.size?.toString() || "",
      farm_id: pond.farm_id || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (pond: Pond) => {
    if (confirm(`Tem certeza que deseja excluir o viveiro "${pond.name}"?`)) {
      deletePond.mutate(pond.id);
    }
  };

  const handleViewCycles = (pond: Pond) => {
    setSelectedPond(pond);
  };

  const handleBackToPonds = () => {
    setSelectedPond(null);
  };

  // If a pond is selected, show its cycles
  if (selectedPond) {
    return <ViveiroDetalhes pond={selectedPond} onBack={handleBackToPonds} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Viveiros</h1>
          <p className="text-muted-foreground">
            Crie e gerencie os viveiros da sua fazenda
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Viveiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPond ? 'Editar Viveiro' : 'Novo Viveiro'}</DialogTitle>
              <DialogDescription>
                {editingPond ? 'Edite as informações do viveiro' : 'Crie um novo viveiro para sua fazenda'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Viveiro</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Viveiro 01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="size">Tamanho (m²)</Label>
                <Input
                  id="size"
                  type="number"
                  step="0.1"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="Ex: 1500"
                />
              </div>
              
              <div>
                <Label htmlFor="farm">Fazenda</Label>
                <Select value={formData.farm_id} onValueChange={(value) => setFormData({ ...formData, farm_id: value })}>
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

              <div className="flex gap-2">
                <Button type="submit" disabled={createPond.isPending || updatePond.isPending}>
                  {(createPond.isPending || updatePond.isPending) ? "Salvando..." : editingPond ? "Atualizar" : "Criar Viveiro"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(pondsByFarm).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(pondsByFarm).map(([farmId, farmPonds]) => (
            <div key={farmId}>
              <h2 className="text-xl font-semibold mb-4">{getFarmName(farmId)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmPonds.map((pond) => (
                  <Card key={pond.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>{pond.name}</span>
                      </CardTitle>
                      <CardDescription>
                        {pond.size ? `${pond.size} m²` : 'Tamanho não informado'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pond)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pond)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => handleViewCycles(pond)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Ciclos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum viveiro encontrado</CardTitle>
            <CardDescription>
              Comece criando seu primeiro viveiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Viveiro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cultivo;