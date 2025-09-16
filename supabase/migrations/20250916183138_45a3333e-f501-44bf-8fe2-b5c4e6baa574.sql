-- Add new fields to daily_feeding table for traceability
ALTER TABLE public.daily_feeding 
ADD COLUMN lote_racao TEXT,
ADD COLUMN fornecedor TEXT;

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  responsavel_id UUID,
  ciclo_id UUID,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em progresso', 'concluída')),
  data_limite DATE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Usuário pode ver suas tarefas" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar suas tarefas" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar suas tarefas" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar suas tarefas" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create health_records table
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ciclo_id UUID NOT NULL,
  data DATE NOT NULL,
  sintomas TEXT,
  diagnostico TEXT,
  tratamento TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on health_records
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Create policies for health_records
CREATE POLICY "Usuário pode ver seus registros de saúde" 
ON public.health_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar seus registros de saúde" 
ON public.health_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus registros de saúde" 
ON public.health_records 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus registros de saúde" 
ON public.health_records 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_responsavel_id_fkey 
FOREIGN KEY (responsavel_id) REFERENCES public.funcionarios(id);

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_ciclo_id_fkey 
FOREIGN KEY (ciclo_id) REFERENCES public.cultivation_cycles(id);

ALTER TABLE public.health_records 
ADD CONSTRAINT health_records_ciclo_id_fkey 
FOREIGN KEY (ciclo_id) REFERENCES public.cultivation_cycles(id);