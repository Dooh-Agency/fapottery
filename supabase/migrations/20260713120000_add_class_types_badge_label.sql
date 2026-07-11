-- Etiqueta personalizable en la esquina de la tarjeta (ej. "Más popular", "Últimas plazas")
ALTER TABLE public.class_types
  ADD COLUMN badge_label TEXT;
