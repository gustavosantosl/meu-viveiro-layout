-- Add pond_id foreign key to feedings table and remove pond_name
ALTER TABLE public.feedings 
ADD COLUMN pond_id UUID REFERENCES public.ponds(id);

-- Update existing records to link to ponds by name if possible
-- This is a best-effort migration - manual data cleanup may be needed
UPDATE public.feedings 
SET pond_id = (
  SELECT p.id 
  FROM public.ponds p 
  WHERE p.name = public.feedings.pond_name 
  AND p.user_id = public.feedings.user_id 
  LIMIT 1
);

-- Make pond_id required for new records
ALTER TABLE public.feedings 
ALTER COLUMN pond_id SET NOT NULL;

-- Remove the old pond_name column
ALTER TABLE public.feedings 
DROP COLUMN pond_name;

-- Create index for better performance
CREATE INDEX idx_feedings_pond_id ON public.feedings(pond_id);