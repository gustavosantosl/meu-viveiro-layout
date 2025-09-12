-- Update feedings table to match the new requirements for data collection
ALTER TABLE public.feedings 
ADD COLUMN IF NOT EXISTS pond_name TEXT,
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS feed_quantity NUMERIC,
ADD COLUMN IF NOT EXISTS water_quality TEXT,
ADD COLUMN IF NOT EXISTS mortality INTEGER;

-- Update existing columns to be not nullable where required
ALTER TABLE public.feedings 
ALTER COLUMN user_id SET NOT NULL;

-- Remove old columns that are not needed anymore (if they exist and are not being used)
-- We'll keep them for now to avoid data loss, but could be cleaned up later

-- Update the updated_at trigger if it doesn't exist for this table
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at column if it doesn't exist
ALTER TABLE public.feedings 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_feedings_updated_at ON public.feedings;
CREATE TRIGGER update_feedings_updated_at
BEFORE UPDATE ON public.feedings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();