-- ═══ Tarjetas de "¿Qué podés encontrar en FA Pottery?" (Home) ═══
CREATE TABLE public.home_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  cta_label TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.home_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view home services" ON public.home_services
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Staff can manage home services" ON public.home_services
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'colaborador'));

-- Storage bucket para las imágenes de estas tarjetas (reutiliza el bucket de site-images)
INSERT INTO public.home_services (position, label, title, description, price, cta_label, cta_link, image_url) VALUES
  (1, 'Propuesta educativa', 'Clases de torno y modelado', 'Grupos reducidos para garantizar un acompañamiento cercano. Clases regulares, workshops y sesiones personalizadas.', 'Desde €35 / clase', 'Ver clases y reservar', '/clases', ''),
  (2, 'Experiencias', 'Workshops para empresas y espacios', 'Actividades cerámicas adaptadas al contexto: team building, eventos culturales, instancias formativas en tu espacio.', 'Consultar precio', 'Consultar disponibilidad', '/colaboraciones', ''),
  (3, 'Tienda', 'Piezas de cerámica artesanal', 'Piezas funcionales y únicas, realizadas a mano en torno y modelado. Series limitadas que podés llevarte a casa.', 'Desde €18', 'Explorar tienda', '/tienda', '')
ON CONFLICT (position) DO NOTHING;
