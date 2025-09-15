-- Create funcionarios table
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_completo TEXT NOT NULL,
  funcao_cargo TEXT NOT NULL,
  salario_mensal NUMERIC NOT NULL,
  data_admissao DATE NOT NULL,
  contato TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Usuário pode ver apenas seus funcionários" 
ON public.funcionarios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar seus funcionários" 
ON public.funcionarios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus funcionários" 
ON public.funcionarios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus funcionários" 
ON public.funcionarios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_funcionarios_updated_at
BEFORE UPDATE ON public.funcionarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();