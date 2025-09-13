-- Criar tabela financeiro
CREATE TABLE public.financeiro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  data DATE NOT NULL,
  categoria TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários podem ver apenas seus registros financeiros" 
ON public.financeiro 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios registros financeiros" 
ON public.financeiro 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registros financeiros" 
ON public.financeiro 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registros financeiros" 
ON public.financeiro 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX idx_financeiro_user_id ON public.financeiro(user_id);
CREATE INDEX idx_financeiro_data ON public.financeiro(data);
CREATE INDEX idx_financeiro_tipo ON public.financeiro(tipo);