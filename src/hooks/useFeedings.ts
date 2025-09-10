import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Feeding {
  id: string;
  user_id: string;
  pond_id: string | null;
  feed_type: string | null;
  quantity: number | null;
  fed_at: string;
}

export const useFeedings = (pondId?: string) => {
  return useQuery({
    queryKey: ['feedings', pondId],
    queryFn: async () => {
      let query = supabase
        .from('feedings')
        .select('*')
        .order('fed_at', { ascending: false });

      if (pondId) {
        query = query.eq('pond_id', pondId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Feeding[];
    },
  });
};

export const useCreateFeeding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (feeding: Omit<Feeding, 'id' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('feedings')
        .insert([{ ...feeding, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedings'] });
      toast({
        title: "Alimentação registrada",
        description: "Alimentação registrada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao registrar alimentação: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFeeding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...feeding }: Partial<Feeding> & { id: string }) => {
      const { data, error } = await supabase
        .from('feedings')
        .update(feeding)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedings'] });
      toast({
        title: "Alimentação atualizada",
        description: "Alimentação atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar alimentação: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFeeding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feedings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedings'] });
      toast({
        title: "Alimentação excluída",
        description: "Alimentação excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir alimentação: " + error.message,
        variant: "destructive",
      });
    },
  });
};