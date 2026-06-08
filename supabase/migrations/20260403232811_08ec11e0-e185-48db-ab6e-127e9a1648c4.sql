
-- Enum for piece categories
CREATE TYPE public.piece_category AS ENUM ('tazas', 'platos', 'bowls', 'jarrones', 'decoracion', 'otro');

-- Enum for piece status
CREATE TYPE public.piece_status AS ENUM ('draft', 'published');

-- Pieces table
CREATE TABLE public.pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category piece_category NOT NULL DEFAULT 'otro',
  status piece_status NOT NULL DEFAULT 'draft',
  stock INTEGER NOT NULL DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;

-- Public can view published pieces
CREATE POLICY "Anyone can view published pieces" ON public.pieces
  FOR SELECT USING (status = 'published');

-- Admin/colaborador can manage pieces
CREATE POLICY "Staff can manage pieces" ON public.pieces
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador')
  );

-- Enable realtime for pieces
ALTER PUBLICATION supabase_realtime ADD TABLE public.pieces;
