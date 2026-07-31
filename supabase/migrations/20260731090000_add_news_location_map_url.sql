-- Enlace de ubicación opcional para que cada novedad pueda dirigir a Google Maps.
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS location_map_url TEXT;
