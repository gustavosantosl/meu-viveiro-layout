-- Create cultivation cycles table
CREATE TABLE public.cultivation_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pond_id UUID NOT NULL,
  user_id UUID NOT NULL,
  nome_ciclo TEXT NOT NULL,
  data_povoamento DATE NOT NULL,
  biomassa_inicial NUMERIC,
  peso_inicial_total NUMERIC,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fim TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'ativo', -- ativo, finalizado
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create biometrics table for weight measurements
CREATE TABLE public.biometrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL,
  user_id UUID NOT NULL,
  data_coleta DATE NOT NULL,
  peso_medio_amostra NUMERIC NOT NULL, -- average weight of sample
  quantidade_amostra INTEGER, -- number of shrimps in sample
  biomassa_estimada NUMERIC, -- estimated total biomass
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create water quality table
CREATE TABLE public.water_quality (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL,
  user_id UUID NOT NULL,
  data_coleta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ph NUMERIC,
  oxigenio_dissolvido NUMERIC,
  temperatura NUMERIC,
  salinidade NUMERIC,
  turbidez NUMERIC,
  alcalinidade NUMERIC,
  cor_agua TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily feeding table (enhanced version)
CREATE TABLE public.daily_feeding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL,
  user_id UUID NOT NULL,
  data_alimentacao DATE NOT NULL,
  quantidade_racao NUMERIC NOT NULL, -- kg of feed
  tipo_racao TEXT,
  mortalidade_observada INTEGER DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cultivation_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_feeding ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cultivation_cycles
CREATE POLICY "Usuário pode ver apenas seus ciclos" 
ON public.cultivation_cycles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar seus ciclos" 
ON public.cultivation_cycles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus ciclos" 
ON public.cultivation_cycles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus ciclos" 
ON public.cultivation_cycles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for biometrics
CREATE POLICY "Usuário pode ver apenas suas biometrias" 
ON public.biometrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar suas biometrias" 
ON public.biometrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar suas biometrias" 
ON public.biometrics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar suas biometrias" 
ON public.biometrics 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for water_quality
CREATE POLICY "Usuário pode ver apenas sua qualidade de água" 
ON public.water_quality 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar registros de qualidade de água" 
ON public.water_quality 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar registros de qualidade de água" 
ON public.water_quality 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar registros de qualidade de água" 
ON public.water_quality 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for daily_feeding
CREATE POLICY "Usuário pode ver apenas suas alimentações" 
ON public.daily_feeding 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar suas alimentações" 
ON public.daily_feeding 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar suas alimentações" 
ON public.daily_feeding 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar suas alimentações" 
ON public.daily_feeding 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_cultivation_cycles_updated_at
BEFORE UPDATE ON public.cultivation_cycles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();