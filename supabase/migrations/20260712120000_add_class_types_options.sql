-- Opciones seleccionables con precio propio (ej. montos de tarjeta regalo, variantes de un taller)
ALTER TABLE public.class_types
  ADD COLUMN options JSONB NOT NULL DEFAULT '[]'::jsonb;
