import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, CalendarIcon, Fish } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { usePonds } from "@/hooks/usePonds";
import { useFarms } from "@/hooks/useFarms";

interface PondWithFarm {
  id: string;
  name: string;
  farm_id: string;
  farm_name: string;
}

interface FeedingRecord {
  id: string;
  pond_id: string;
  date: string;
  feed_quantity: number;
  water_quality?: string;
  mortality?: number;
  created_at?: string;
  updated_at?: string;
  fed_at?: string;
  feed_type?: string;
  quantity?: number;
  user_id?: string;
  pond?: {
    name: string;
    farm?: {
      name: string;
    };
  };
}

const ColetaDados = () => {
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FeedingRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [pondsWithFarms, setPondsWithFarms] = useState<PondWithFarm[]>([]);
  const [formData, setFormData] = useState({
    pond_id: "",
    feed_quantity: "",
    water_quality: "",
    mortality: ""
  });
  const { toast } = useToast();
  const { data: farms } = useFarms();
  const { data: ponds } = usePonds();

  useEffect(() => {
    fetchRecords();
    fetchPondsWithFarms();
  }, []);
  
  const fetchPondsWithFarms = async () => {
    if (!ponds || !farms) return;
    
    const pondsWithFarmData: PondWithFarm[] = ponds.map(pond => {
      const farm = farms.find(f => f.id === pond.farm_id);
      return {
        id: pond.id,
        name: pond.name,
        farm_id: pond.farm_id || '',
        farm_name: farm?.name || 'Fazenda não encontrada'
      };
    });
    
    setPondsWithFarms(pondsWithFarmData);
  };
  
  useEffect(() => {
    fetchPondsWithFarms();
  }, [ponds, farms]);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('feedings')
      .select(`
        *,
        pond:ponds (
          name,
          farm:shrimp_farms (
            name
          )
        )
      `)
      .not('pond_id', 'is', null)
      .not('date', 'is', null)
      .not('feed_quantity', 'is', null)
      .order('date', { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar registros: " + error.message,
        variant: "destructive"
      });
    } else {
      setRecords(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pond_id || !selectedDate || !formData.feed_quantity) {
      toast({
        title: "Erro",
        description: "Campos obrigatórios: Viveiro, Data e Quantidade de Ração",
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
        pond_id: formData.pond_id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        feed_quantity: parseFloat(formData.feed_quantity),
        water_quality: formData.water_quality || null,
        mortality: formData.mortality ? parseInt(formData.mortality) : null,
        user_id: user.id
      };

      if (isEditMode && editingRecord) {
        const { error } = await supabase
          .from('feedings')
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
          .from('feedings')
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

  const handleEdit = (record: FeedingRecord) => {
    setIsEditMode(true);
    setEditingRecord(record);
    setFormData({
      pond_id: record.pond_id,
      feed_quantity: record.feed_quantity.toString(),
      water_quality: record.water_quality || "",
      mortality: record.mortality?.toString() || ""
    });
    setSelectedDate(new Date(record.date));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este registro?")) {
      return;
    }

    const { error } = await supabase
      .from('feedings')
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
    setFormData({ pond_id: "", feed_quantity: "", water_quality: "", mortality: "" });
    setSelectedDate(undefined);
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-foreground">Coleta de Dados</h1>
          <p className="text-muted-foreground font-inter">Registro de alimentação e monitoramento</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditMode(false)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Registro" : "Novo Registro"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pond_id">Viveiro *</Label>
                <Select value={formData.pond_id} onValueChange={(value) => setFormData({ ...formData, pond_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um viveiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {pondsWithFarms.map((pond) => (
                      <SelectItem key={pond.id} value={pond.id}>
                        {pond.name} - {pond.farm_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                <Label htmlFor="feed_quantity">Quantidade de Ração (kg) *</Label>
                <Input
                  id="feed_quantity"
                  type="number"
                  value={formData.feed_quantity}
                  onChange={(e) => setFormData({ ...formData, feed_quantity: e.target.value })}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water_quality">Qualidade da Água</Label>
                <Textarea
                  id="water_quality"
                  value={formData.water_quality}
                  onChange={(e) => setFormData({ ...formData, water_quality: e.target.value })}
                  placeholder="Observações sobre a qualidade da água (opcional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mortality">Mortalidade</Label>
                <Input
                  id="mortality"
                  type="number"
                  value={formData.mortality}
                  onChange={(e) => setFormData({ ...formData, mortality: e.target.value })}
                  placeholder="Número de mortes (opcional)"
                  min="0"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {isEditMode ? "Atualizar" : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {records.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Fish className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando o primeiro registro de coleta de dados
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Registro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <Card key={record.id} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">{record.pond?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fazenda: {record.pond?.farm?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(record.date), "dd/MM/yyyy", { locale: pt })}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
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
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ração:</span>
                  <span className="font-semibold text-primary">{record.feed_quantity} kg</span>
                </div>
                
                {record.mortality !== null && record.mortality > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mortalidade:</span>
                    <span className="font-semibold text-destructive">{record.mortality}</span>
                  </div>
                )}

                {record.water_quality && (
                  <div className="mt-3 p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Qualidade da Água:</p>
                    <p className="text-sm">{record.water_quality}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColetaDados;