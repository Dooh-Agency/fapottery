-- Campañas de captación configurables desde el backoffice.
CREATE TABLE public.home_popup_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  badge TEXT,
  title TEXT NOT NULL,
  body TEXT,
  cta_label TEXT NOT NULL DEFAULT 'Suscribirme',
  objective TEXT NOT NULL DEFAULT 'lead' CHECK (objective IN ('info', 'lead', 'discount', 'link')),
  cta_url TEXT,
  discount_code TEXT,
  success_title TEXT NOT NULL DEFAULT '¡Gracias!',
  success_body TEXT,
  show_name BOOLEAN NOT NULL DEFAULT true,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  privacy_text TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.home_popup_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.home_popup_campaigns(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, email)
);

ALTER TABLE public.home_popup_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_popup_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active popup campaigns" ON public.home_popup_campaigns
  FOR SELECT TO public USING (is_active AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now()));
CREATE POLICY "Staff manages popup campaigns" ON public.home_popup_campaigns
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));
CREATE POLICY "Public can submit popup leads" ON public.home_popup_leads
  FOR INSERT TO public WITH CHECK (marketing_consent = true);
CREATE POLICY "Staff manages popup leads" ON public.home_popup_leads
  FOR ALL TO public USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));
