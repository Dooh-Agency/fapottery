-- Galería de imágenes adicional para la vista de detalle de clase/workshop
-- (image_url sigue siendo la portada usada en el listado)
ALTER TABLE public.class_types
  ADD COLUMN images TEXT[] NOT NULL DEFAULT '{}';
