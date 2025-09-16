import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HealthRecord {
  id: string;
  ciclo_id: string;
  data: string;
  sintomas: string | null;
  diagnostico: string | null;
  tratamento: string | null;
  user_id: string;
  created_at: string;
}

export const useHealthRecords = (cycleId: string) => {
  return useQuery({
    queryKey: ['health-records', cycleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('ciclo_id', cycleId)
        .order('data', { ascending: false });

      if (error) throw error;
      return data as HealthRecord[];
    },
    enabled: !!cycleId,
  });
};

export const useCreateHealthRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (record: Omit<HealthRecord, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('health_records')
        .insert([{ ...record, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast({
        title: "Registro de saúde criado",
        description: "Registro de saúde criado com sucesso!",
      });
    },
  });
};

export const useUpdateHealthRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<HealthRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('health_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast({
        title: "Registro atualizado",
        description: "Registro de saúde atualizado com sucesso!",
      });
    },
  });
};

export const useDeleteHealthRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast({
        title: "Registro excluído",
        description: "Registro de saúde excluído com sucesso!",
      });
    },
  });
};