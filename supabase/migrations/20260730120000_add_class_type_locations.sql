-- Las clases regulares pueden impartirse en más de una sede. Conservamos los
-- campos anteriores para las actividades que sólo tienen una ubicación.
ALTER TABLE public.class_types
  ADD COLUMN locations JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Migrar la ubicación única existente para que las clases regulares no pierdan
-- información al pasar al nuevo editor de sedes.
UPDATE public.class_types
SET locations = jsonb_build_array(
  jsonb_strip_nulls(jsonb_build_object(
    'name', location_text,
    'map_url', location_map_url
  ))
)
WHERE category = 'regulares'
  AND location_text IS NOT NULL
  AND btrim(location_text) <> '';
