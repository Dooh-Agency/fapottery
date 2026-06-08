
-- ═══ News/Novedades table ═══
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  instagram_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news" ON public.news
  FOR SELECT TO public
  USING (is_published = true);

CREATE POLICY "Staff can manage news" ON public.news
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador'));

-- ═══ Site images / hero banners table ═══
CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images" ON public.site_images
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Staff can manage site images" ON public.site_images
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador'));

-- ═══ Storage bucket for news images ═══
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view news images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'news-images');

CREATE POLICY "Staff can upload news images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador')));

CREATE POLICY "Staff can update news images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'news-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador')));

CREATE POLICY "Staff can delete news images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'news-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador')));

-- ═══ Storage bucket for site header images ═══
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view site images bucket" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'site-images');

CREATE POLICY "Staff can upload site images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador')));

CREATE POLICY "Staff can update site images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador')));

CREATE POLICY "Staff can delete site images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador')));

-- Seed default section keys
INSERT INTO public.site_images (section_key, image_url, alt_text) VALUES
  ('propuesta-educativa', '', 'Propuesta Educativa header'),
  ('produccion', '', 'Producción header'),
  ('colaboraciones', '', 'Colaboraciones header'),
  ('clases', '', 'Clases header')
ON CONFLICT (section_key) DO NOTHING;
