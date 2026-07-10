-- Manual "destacado" flag for the Clases page hero/slider
ALTER TABLE public.class_types
  ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
