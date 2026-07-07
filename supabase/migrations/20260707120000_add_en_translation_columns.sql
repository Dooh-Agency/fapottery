-- English translation columns, auto-populated by the translate-content edge function
ALTER TABLE public.class_types
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS faq_en JSONB;

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS body_en TEXT;
