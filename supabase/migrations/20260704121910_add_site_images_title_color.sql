-- Permite elegir el color del texto de título que se muestra sobre el hero
ALTER TABLE public.site_images ADD COLUMN IF NOT EXISTS title_color TEXT;
