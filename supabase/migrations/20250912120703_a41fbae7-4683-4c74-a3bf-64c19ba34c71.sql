-- Create inventory table for managing inputs and harvested products
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Usuário pode ver apenas seus itens de estoque" 
ON public.inventory 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode criar seus itens de estoque" 
ON public.inventory 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seus itens de estoque" 
ON public.inventory 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar seus itens de estoque" 
ON public.inventory 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();