import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CultivationCycle {
  id: string;
  pond_id: string;
  user_id: string;
  nome_ciclo: string;
  data_povoamento: string;
  biomassa_inicial: number | null;
  peso_inicial_total: number | null;
  data_inicio: string;
  data_fim: string | null;
  status: 'ativo' | 'finalizado';
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BiometricData {
  id: string;
  cycle_id: string;
  user_id: string;
  data_coleta: string;
  peso_medio_amostra: number;
  quantidade_amostra: number | null;
  biomassa_estimada: number | null;
  observacoes: string | null;
  created_at: string;
}

export interface WaterQuality {
  id: string;
  cycle_id: string;
  user_id: string;
  data_coleta: string;
  ph: number | null;
  oxigenio_dissolvido: number | null;
  temperatura: number | null;
  salinidade: number | null;
  turbidez: number | null;
  alcalinidade: number | null;
  cor_agua: string | null;
  observacoes: string | null;
  created_at: string;
}

export interface DailyFeeding {
  id: string;
  cycle_id: string;
  user_id: string;
  data_alimentacao: string;
  quantidade_racao: number;
  tipo_racao: string | null;
  mortalidade_observada: number;
  observacoes: string | null;
  lote_racao: string | null;
  fornecedor: string | null;
  created_at: string;
}

export const useCultivationCycles = (pondId?: string) => {
  return useQuery({
    queryKey: ['cultivation-cycles', pondId],
    queryFn: async () => {
      let query = supabase
        .from('cultivation_cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (pondId) {
        query = query.eq('pond_id', pondId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CultivationCycle[];
    },
  });
};

export const useCreateCultivationCycle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cycle: Omit<CultivationCycle, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('cultivation_cycles')
        .insert([{ ...cycle, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cultivation-cycles'] });
      toast({
        title: "Ciclo criado",
        description: "Ciclo de cultivo criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar ciclo: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useBiometricData = (cycleId: string) => {
  return useQuery({
    queryKey: ['biometrics', cycleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biometrics')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('data_coleta', { ascending: false });

      if (error) throw error;
      return data as BiometricData[];
    },
    enabled: !!cycleId,
  });
};

export const useCreateBiometric = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (biometric: Omit<BiometricData, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('biometrics')
        .insert([{ ...biometric, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biometrics'] });
      toast({
        title: "Biometria registrada",
        description: "Dados biométricos registrados com sucesso!",
      });
    },
  });
};

export const useWaterQuality = (cycleId: string) => {
  return useQuery({
    queryKey: ['water-quality', cycleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('water_quality')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('data_coleta', { ascending: false });

      if (error) throw error;
      return data as WaterQuality[];
    },
    enabled: !!cycleId,
  });
};

export const useCreateWaterQuality = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (waterQuality: Omit<WaterQuality, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('water_quality')
        .insert([{ ...waterQuality, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-quality'] });
      toast({
        title: "Qualidade da água registrada",
        description: "Dados de qualidade da água registrados com sucesso!",
      });
    },
  });
};

export const useDailyFeeding = (cycleId: string) => {
  return useQuery({
    queryKey: ['daily-feeding', cycleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_feeding')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('data_alimentacao', { ascending: false });

      if (error) throw error;
      return data as DailyFeeding[];
    },
    enabled: !!cycleId,
  });
};

export const useCreateDailyFeeding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (feeding: Omit<DailyFeeding, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('daily_feeding')
        .insert([{ ...feeding, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-feeding'] });
      toast({
        title: "Alimentação registrada",
        description: "Dados de alimentação registrados com sucesso!",
      });
    },
  });
};