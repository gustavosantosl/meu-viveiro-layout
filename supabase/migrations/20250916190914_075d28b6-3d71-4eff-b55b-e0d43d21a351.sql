-- Add harvest and performance fields to cultivation_cycles table
ALTER TABLE public.cultivation_cycles 
ADD COLUMN data_despesca date,
ADD COLUMN peso_final_despesca numeric,
ADD COLUMN preco_venda_kg numeric,
ADD COLUMN receita_total numeric,
ADD COLUMN fca_final numeric,
ADD COLUMN sobrevivencia_final numeric;

-- Add index for better performance on status queries
CREATE INDEX idx_cultivation_cycles_status ON public.cultivation_cycles(status);

-- Add check constraint to ensure data_despesca is after data_povoamento
ALTER TABLE public.cultivation_cycles 
ADD CONSTRAINT check_despesca_after_povoamento 
CHECK (data_despesca IS NULL OR data_despesca >= data_povoamento);