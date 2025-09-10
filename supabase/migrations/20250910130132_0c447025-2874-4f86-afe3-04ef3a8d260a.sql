-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Usuário pode ver apenas o próprio perfil" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuário pode inserir apenas o próprio perfil" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuário pode atualizar apenas o próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create shrimp_farms table
CREATE TABLE public.shrimp_farms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shrimp_farms
ALTER TABLE public.shrimp_farms ENABLE ROW LEVEL SECURITY;

-- Create policies for shrimp_farms
CREATE POLICY "Usuário pode ver apenas suas fazendas" 
ON public.shrimp_farms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir apenas suas fazendas" 
ON public.shrimp_farms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar apenas suas fazendas" 
ON public.shrimp_farms 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar apenas suas fazendas" 
ON public.shrimp_farms 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create ponds table
CREATE TABLE public.ponds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  farm_id UUID,
  name TEXT NOT NULL,
  size NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ponds
ALTER TABLE public.ponds ENABLE ROW LEVEL SECURITY;

-- Create policies for ponds
CREATE POLICY "Usuário pode ver apenas seus tanques" 
ON public.ponds 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir apenas seus tanques" 
ON public.ponds 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar apenas seus tanques" 
ON public.ponds 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar apenas seus tanques" 
ON public.ponds 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create feedings table
CREATE TABLE public.feedings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  pond_id UUID,
  feed_type TEXT,
  quantity NUMERIC,
  fed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on feedings
ALTER TABLE public.feedings ENABLE ROW LEVEL SECURITY;

-- Create policies for feedings
CREATE POLICY "Usuário pode ver apenas suas alimentações" 
ON public.feedings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode inserir apenas suas alimentações" 
ON public.feedings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar apenas suas alimentações" 
ON public.feedings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode deletar apenas suas alimentações" 
ON public.feedings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();