-- Permite que una sección del hero use un color de fondo liso en vez de imagen
ALTER TABLE public.site_images ADD COLUMN IF NOT EXISTS bg_color TEXT;
