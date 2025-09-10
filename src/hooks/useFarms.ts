import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ShrimpFarm {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  created_at: string;
}

export const useFarms = () => {
  return useQuery({
    queryKey: ['farms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shrimp_farms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShrimpFarm[];
    },
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (farm: Omit<ShrimpFarm, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('shrimp_farms')
        .insert([{ ...farm, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast({
        title: "Fazenda criada",
        description: "Fazenda criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar fazenda: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFarm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...farm }: Partial<ShrimpFarm> & { id: string }) => {
      const { data, error } = await supabase
        .from('shrimp_farms')
        .update(farm)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast({
        title: "Fazenda atualizada",
        description: "Fazenda atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar fazenda: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFarm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shrimp_farms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast({
        title: "Fazenda excluída",
        description: "Fazenda excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir fazenda: " + error.message,
        variant: "destructive",
      });
    },
  });
};