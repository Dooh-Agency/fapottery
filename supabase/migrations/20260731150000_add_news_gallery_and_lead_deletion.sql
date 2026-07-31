-- Las novedades pueden incluir varias imágenes además de la portada usada en el listado.
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';

-- El panel necesita poder retirar preinscripciones creadas durante pruebas.
CREATE POLICY "Staff can delete event interest leads"
  ON public.event_interest_leads FOR DELETE TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));
