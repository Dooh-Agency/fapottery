-- Registra preinscripciones de eventos antes de derivarlas a WhatsApp.
-- La información comercial queda disponible sólo para el equipo autorizado.
CREATE TABLE public.event_interest_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL CHECK (event_key IN ('breakfast_paint_2026_08_01')),
  full_name TEXT,
  email TEXT NOT NULL CHECK (char_length(trim(email)) > 3),
  event_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  entry_point TEXT NOT NULL CHECK (entry_point IN ('landing', 'popup', 'activity')),
  source_path TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'reserved', 'not_interested')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_key, email)
);

ALTER TABLE public.event_interest_leads ENABLE ROW LEVEL SECURITY;

-- El público sólo puede crear su propia preinscripción; no puede leer ni modificar la base.
CREATE POLICY "Anyone can register interest in the announced Breakfast & Paint event"
  ON public.event_interest_leads FOR INSERT TO public
  WITH CHECK (
    event_key = 'breakfast_paint_2026_08_01'
    AND event_consent = true
    AND status = 'new'
  );

CREATE POLICY "Staff can view event interest leads"
  ON public.event_interest_leads FOR SELECT TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

CREATE POLICY "Staff can update event interest leads"
  ON public.event_interest_leads FOR UPDATE TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));
