-- Agrega texto editable (subtítulo) por sección, para el bloque que va debajo del hero
ALTER TABLE public.site_images ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- Asegura que existan las secciones usadas por Clases, Tienda y Novedades,
-- y completa el subtítulo por defecto solo si la sección todavía no tiene uno cargado.
INSERT INTO public.site_images (section_key, image_url, alt_text, subtitle) VALUES
  ('clases', '', 'Clases header', 'Explorá las opciones de talleres y reservá tu lugar.'),
  ('catalogo', '', 'Tienda de piezas de cerámica', 'Piezas únicas hechas a mano'),
  ('novedades', '', 'Novedades del estudio', 'Últimas noticias, eventos y novedades del estudio.')
ON CONFLICT (section_key) DO UPDATE
  SET subtitle = COALESCE(public.site_images.subtitle, EXCLUDED.subtitle);
