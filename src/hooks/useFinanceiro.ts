import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FinanceiroRecord {
  id: string;
  data: string;
  valor: number;
  categoria: string;
  tipo: 'entrada' | 'saida';
  descricao?: string;
  criado_em: string;
  user_id: string;
}

export const useFinanceiro = (filters?: {
  startDate?: Date;
  endDate?: Date;
  categoria?: string;
  periodo?: 'dia' | 'mes' | 'ano';
}) => {
  const [records, setRecords] = useState<FinanceiroRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('financeiro')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('data', filters.startDate.toISOString().split('T')[0]);
      }

      if (filters?.endDate) {
        query = query.lte('data', filters.endDate.toISOString().split('T')[0]);
      }

      if (filters?.categoria) {
        query = query.eq('categoria', filters.categoria);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords((data || []) as FinanceiroRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar registros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user, filters]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('financeiro-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financeiro',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchRecords();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { records, loading, error, refetch: fetchRecords };
};

export const useFinanceiroSummary = (periodo: 'dia' | 'mes' | 'ano' = 'mes') => {
  const [summary, setSummary] = useState({
    faturamento: 0,
    despesas: 0,
    saldo: 0
  });

  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (periodo) {
    case 'dia':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'ano':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
      break;
    default: // mes
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  const { records } = useFinanceiro({ startDate, endDate });

  useEffect(() => {
    const entradas = records
      .filter(r => r.tipo === 'entrada')
      .reduce((sum, r) => sum + Number(r.valor), 0);

    const saidas = records
      .filter(r => r.tipo === 'saida')
      .reduce((sum, r) => sum + Number(r.valor), 0);

    setSummary({
      faturamento: entradas,
      despesas: saidas,
      saldo: entradas - saidas
    });
  }, [records]);

  return summary;
};