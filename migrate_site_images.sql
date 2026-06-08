INSERT INTO site_images (id, section_key, image_url, alt_text, updated_at, updated_by) VALUES
('c7282fc7-44e8-4522-9261-eae7385ed814', 'colaboraciones', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/colaboraciones-1775497530752.png', 'Colaboraciones header', '2026-04-06 17:45:32.298+00', NULL),
('676fc2de-6e64-4f45-bf9b-f379103be754', 'produccion', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/produccion-1775500153652.jpg', 'Producción header', '2026-04-06 18:29:14.856+00', NULL),
('f13edb14-6097-4cb3-8c53-ad1c00b5df2c', 'clases', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/clases-1775567060399.png', 'Clases header', '2026-04-07 13:04:21.659+00', NULL),
('233fe980-43c8-40fd-808c-313fe10c1b9a', 'propuesta-educativa', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/propuesta-educativa-1775567073545.png', 'Propuesta Educativa header', '2026-04-07 13:04:34.866+00', NULL),
('63138ab1-73d5-44fe-b26a-af75d8e1024b', 'novedades', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/novedades-1775567942351.png', 'Novedades header', '2026-04-07 13:19:03.738+00', NULL),
('0ed5afa0-c82c-4540-a05c-e2186b18ac94', 'catalogo', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/catalogo-1775569238614.png', 'Tienda header', '2026-04-07 13:40:40.428+00', NULL)
ON CONFLICT (id) DO NOTHING;
