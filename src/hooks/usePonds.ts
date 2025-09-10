import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Pond {
  id: string;
  user_id: string;
  farm_id: string | null;
  name: string;
  size: number | null;
  created_at: string;
}

export const usePonds = (farmId?: string) => {
  return useQuery({
    queryKey: ['ponds', farmId],
    queryFn: async () => {
      let query = supabase
        .from('ponds')
        .select('*')
        .order('created_at', { ascending: false });

      if (farmId) {
        query = query.eq('farm_id', farmId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Pond[];
    },
  });
};

export const useCreatePond = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pond: Omit<Pond, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('ponds')
        .insert([{ ...pond, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ponds'] });
      toast({
        title: "Tanque criado",
        description: "Tanque criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar tanque: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePond = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...pond }: Partial<Pond> & { id: string }) => {
      const { data, error } = await supabase
        .from('ponds')
        .update(pond)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ponds'] });
      toast({
        title: "Tanque atualizado",
        description: "Tanque atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar tanque: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePond = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ponds')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ponds'] });
      toast({
        title: "Tanque excluído",
        description: "Tanque excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir tanque: " + error.message,
        variant: "destructive",
      });
    },
  });
};