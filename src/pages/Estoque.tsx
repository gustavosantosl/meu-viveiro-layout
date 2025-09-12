import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  created_at: string;
}

const Estoque = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: ""
  });
  const { toast } = useToast();

  const categories = [
    "Ração",
    "Fertilizante", 
    "Equipamento",
    "Produto Colhido",
    "Medicamento",
    "Outros"
  ];

  const units = ["un", "kg", "litro", "ton", "saco"];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar itens do estoque: " + error.message,
        variant: "destructive"
      });
    } else {
      setItems(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.quantity || !formData.unit) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerenciar o estoque",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditMode && editingItem) {
        const { error } = await supabase
          .from('inventory')
          .update({
            name: formData.name,
            category: formData.category,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit
          })
          .eq('id', editingItem.id);

        if (error) {
          toast({
            title: "Erro",
            description: "Erro ao atualizar item: " + error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sucesso",
            description: "Item atualizado com sucesso!"
          });
          fetchItems();
          resetForm();
        }
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert([{
            name: formData.name,
            category: formData.category,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
            user_id: user.id
          }]);

        if (error) {
          toast({
            title: "Erro", 
            description: "Erro ao adicionar item: " + error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sucesso",
            description: "Item adicionado ao estoque com sucesso!"
          });
          fetchItems();
          resetForm();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar item",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setIsEditMode(true);
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir item: " + error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Item excluído com sucesso!"
      });
      fetchItems();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "", quantity: "", unit: "" });
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-foreground">Estoque</h1>
          <p className="text-muted-foreground font-inter">Controle de insumos e produtos</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditMode(false)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Item" : "Novo Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {isEditMode ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum item no estoque</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando itens ao seu estoque
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.unit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Estoque;