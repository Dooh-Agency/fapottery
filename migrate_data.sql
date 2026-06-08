-- ============================================================
-- SITE IMAGES
-- ============================================================
INSERT INTO site_images (id, section_key, image_url, alt_text, updated_at, updated_by) VALUES
('c7282fc7-44e8-4522-9261-eae7385ed814', 'colaboraciones', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/colaboraciones-1775497530752.png', 'Colaboraciones header', '2026-04-06 17:45:32.298+00', NULL),
('676fc2de-6e64-4f45-bf9b-f379103be754', 'produccion', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/produccion-1775500153652.jpg', 'Producción header', '2026-04-06 18:29:14.856+00', NULL),
('f13edb14-6097-4cb3-8c53-ad1c00b5df2c', 'clases', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/clases-1775567060399.png', 'Clases header', '2026-04-07 13:04:21.659+00', NULL),
('233fe980-43c8-40fd-808c-313fe10c1b9a', 'propuesta-educativa', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/propuesta-educativa-1775567073545.png', 'Propuesta Educativa header', '2026-04-07 13:04:34.866+00', NULL),
('63138ab1-73d5-44fe-b26a-af75d8e1024b', 'novedades', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/novedades-1775567942351.png', 'Novedades header', '2026-04-07 13:19:03.738+00', NULL),
('0ed5afa0-c82c-4540-a05c-e2186b18ac94', 'catalogo', 'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/site-images/catalogo-1775569238614.png', 'Tienda header', '2026-04-07 13:40:40.428+00', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PIECES
-- ============================================================
INSERT INTO pieces (id, title, description, price, category, status, stock, images, created_by, created_at, updated_at) VALUES
(
  '944e7563-e588-442c-a22a-42898261a51a',
  'Lota Elefant (Jala Neti)',
  'La Lota Elefant fue diseñada con una forma anatómica para facilitar su uso y garantizar un mejor sostén durante la práctica.

La idea conceptual y su formato particular dieron origen al nombre de la marca, y su diseño distintivo y de calidad es lo que las hace únicas y especiales en el mercado nacional e internacional.

La lota permite realizar la práctica de ducha y limpieza nasal, con una capacidad de aproximadamente 300 ml.

Sobre la práctica de Jala Neti:
El Jala Neti es una técnica muy beneficiosa para proporcionar alivio a problemas nasales, congestión, infecciones, alergias, asma, resfríos y dolores de cabeza. Es especialmente recomendado para diagnósticos de sinusitis y rinitis crónica.

Además de ayudar en el sistema respiratorio superior y nervioso, es una práctica saludable para el bienestar de la mente, dado que permite una respiración más completa y libre, aumentando la energía vital.

Colores disponibles: Turquesa, Azul, Beige, Blanco.',
  45.00, 'otro', 'published', 1,
  ARRAY['https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/lota-elefant-1.webp','https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/lota-elefant-2.webp','https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/lota-elefant-3.webp','https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/lota-elefant-4.webp','https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/lota-elefant-5.webp'],
  NULL, '2026-04-03 23:42:50.515036+00', '2026-04-03 23:42:50.515036+00'
),
(
  'cb715554-13c9-451d-9e71-3b15438b7ee4',
  'Lámpara "Hornito" para aromaterapia (220V)',
  'Lámpara con sistema eléctrico (220v), con recipiente difusor de aromas para aceites esenciales. Son versátiles y perfectas para dar una iluminación tenue ambiental, perfumando cualquier ambiente.
Perfectas para dar una hermosa iluminación ambiental, perfumado con aceites esenciales.

Dimensiones aproximadas
Diámetro 18.5 cm
Alto 25 cm
Peso 1250 grs.

AVISO IMPORTANTE
Teniendo en cuenta que los productos son realizados de forma artesanal y se hacen a pedido, el tiempo de entrega de las compras en la tienda online, puede variar según la demanda y disponibilidad de stock.',
  55.00, 'decoracion', 'published', 1,
  ARRAY['https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/2f6aabdb-902a-4d27-8fe2-77ab0704046b.webp'],
  NULL, '2026-04-04 00:22:13.746445+00', '2026-04-04 00:22:13.746445+00'
),
(
  '61402206-3fd6-4f72-bc11-07018532d323',
  'Pino Navideño con Luz (220v)',
  'Lámpara de cerámica con sistema eléctrico (220v) realizada a mano y compuesta por dos piezas: cono y base con luz. Las lámparas están armadas con cable doble vaina, enchufe inyectado de alta calidad, portalámparas y una lámpara E14 de led bajo consumo.

El producto Incluye:
1 pino en forma de cono de cerámica
1 plato base de cerámica
1 sistema eléctrico
1 lámpara led
AVISO IMPORTANTE
Teniendo en cuenta que los productos son realizados de forma artesanal y se hacen a pedido, el tiempo de entrega de las compras en la tienda online, puede variar según la demanda y disponibilidad de stock.',
  80.00, 'decoracion', 'published', 1,
  ARRAY['https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/f643e5cc-013b-4b67-bf3a-2de8f6ab26c2.webp','https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/eb85d670-edc9-4a3d-831b-ff695a082c6f.jpg','https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/piece-images/5fc0c501-51ad-4307-96bd-212b35013362.jpg'],
  NULL, '2026-04-04 00:29:07.528704+00', '2026-04-04 00:29:07.528704+00'
),
(
  'c3557983-0362-49ec-bf09-9da806402ba2',
  'Mortero',
  'Mortero de cerámica artesanal, realizado a mano en torno. Disponible en varios esmaltes: turquesa, azul, beige y blanco jaspeado.

Dimensiones aproximadas:
Altura: 6-8 cm
Diámetro: 10-12 cm
Peso: 700 g

Pieza realizada de forma artesanal y bajo pedido. Los plazos de entrega pueden variar según la demanda y la disponibilidad.',
  0.00, 'otro', 'published', 1,
  ARRAY['https://dcdn-us.mitiendanube.com/stores/005/305/829/products/8mortero-5b1fe6c2e03cba835917307529575505-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_8eb7240d159f47079973dc762f7e9579mv2-951beda35ce295b13517280741231547-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_e9f1a59d84bd4d038d78a3753cfee37emv2-c495c1062d7eaa77ad17280741298386-1024-1024.webp'],
  NULL, '2026-04-07 13:28:05.776553+00', '2026-04-07 13:28:05.776553+00'
),
(
  '14193dc5-ec6a-41db-af45-3f7bce5e37eb',
  'Set de Sushi',
  'Set de sushi de cerámica artesanal compuesto por 1 bandeja ovalada y 1 copetinero cilindro small. Disponible en varios esmaltes: azul, beige, blanco y turquesa.

Pieza realizada de forma artesanal y bajo pedido. Los plazos de entrega pueden variar según la demanda y la disponibilidad.',
  0.00, 'platos', 'published', 1,
  ARRAY['https://dcdn-us.mitiendanube.com/stores/005/305/829/products/1-8b10bc1e6c630ac4da17291969517645-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/458472195_920195250137765_3837833968235713897_n-1e81f8e0d5af89f03517291941334394-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/2-9e57ed42a4c8e11e5417291969516310-1024-1024.webp'],
  NULL, '2026-04-07 13:28:05.776553+00', '2026-04-07 13:28:05.776553+00'
),
(
  'b65a29b4-52a0-4dfa-b8c0-86665bd0e318',
  'Cuenco Trapecio (M: 20 cm)',
  'Cuenco de cerámica artesanal con forma trapezoidal, realizado a mano en torno. Disponible en varios esmaltes: turquesa, beige, azul y blanco jaspeado.

Dimensiones:
Diámetro: 20 cm
Altura: 4 cm
Peso: 750 g

Pieza realizada de forma artesanal y bajo pedido. Los plazos de entrega pueden variar según la demanda y la disponibilidad.',
  0.00, 'bowls', 'published', 1,
  ARRAY['https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_a5038505fb064657bb15360d599ec2a6mv2-f020074bbddbe0ba0f17281438498955-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_b8cf6d52b3f54964b9f35631b388cf39mv2-e9a83d7636c1634ad117281438645237-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_829b424bcf7944998fd9e9227a9ad14amv2-61c05835506580149617281438696768-1024-1024.webp'],
  NULL, '2026-04-07 13:28:05.776553+00', '2026-04-07 13:28:05.776553+00'
),
(
  'dcaea963-921b-4379-b215-bca4c78f3a63',
  'Bandeja Circular Alta (30 cm)',
  'Bandeja circular alta de cerámica artesanal, realizada a mano en torno. Disponible en varios esmaltes: beige, blanco, azul y turquesa.

Dimensiones aproximadas:
Diámetro: 30 cm
Altura: 4,5 cm
Peso: 1300 g

Opciones de color: verde, negro, turquesa, beige.

Pieza realizada de forma artesanal y bajo pedido. Los plazos de entrega pueden variar según la demanda y la disponibilidad.',
  0.00, 'platos', 'published', 1,
  ARRAY['https://dcdn-us.mitiendanube.com/stores/005/305/829/products/productos-tienda-2-6fdda51dd3df83b88717307485450962-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_828c3c4f366a4e7c9483e1277b05b6e4mv2-e70deda09dcd8f96aa17281455313795-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_9742818867e6445e92dd7105af8c8494mv2-1bc703210fa6cba65317281455507504-1024-1024.webp'],
  NULL, '2026-04-07 13:28:05.776553+00', '2026-04-07 13:28:05.776553+00'
),
(
  '924a6642-6ffe-4f87-a489-889a5e6d3db1',
  'Bandeja Circular Baja (30 cm)',
  'Bandeja circular baja de cerámica artesanal, realizada a mano en torno. Disponible en varios esmaltes: beige, blanco, turquesa y azul.

Dimensiones aproximadas:
Diámetro: 31,5 cm
Altura: 1,5 cm
Peso: 1000 g

Pieza realizada de forma artesanal y bajo pedido. Los plazos de entrega pueden variar según la demanda y la disponibilidad.',
  0.00, 'platos', 'published', 1,
  ARRAY['https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_13a6146c4db4418cbf40f562b38369a7mv2-8986ae93b21c94bb9b17281453476885-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_bdab1e6303fd451fa0df3c8c7f679957mv2-ea6a64bb57b35a5a6b17281453603182-1024-1024.webp','https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_4458c3470b874057aa3c77e9cff0cee2mv2-a1fc2083aee65fcb6717281453699301-1024-1024.webp'],
  NULL, '2026-04-07 13:28:05.776553+00', '2026-04-07 13:28:05.776553+00'
),
(
  'd504fd0e-001b-446f-948c-958cdad188c6',
  'Lavabo de cerámica',
  'Diseñamos lavabos que acompañan los espacios armónicamente, integrándose con naturalidad pero sin pasar inadvertidos a la mirada. Cada pieza es realizada a mano, lo que la convierte en una pieza única y una obra de arte original.

Fabricados con arcillas y esmaltes de gres de alta temperatura, son más resistentes en el uso. Tanto los procesos como los materiales de alta calidad garantizan que cada pieza mantenga su aspecto original en el tiempo, convirtiéndola en una inversión a largo plazo.

Pieza realizada de forma artesanal y bajo pedido. Los plazos de entrega pueden variar según la demanda y la disponibilidad.',
  0.00, 'decoracion', 'published', 1,
  ARRAY['https://dcdn-us.mitiendanube.com/stores/005/305/829/products/4751e6_dbd83e055f0e494d8069492b8c80ff2amv2-d790a86739f4b351a117281466004422-1024-1024.webp'],
  NULL, '2026-04-07 13:28:05.776553+00', '2026-04-07 13:28:05.776553+00'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NEWS
-- ============================================================
INSERT INTO news (id, title, body, image_url, instagram_url, is_published, published_at, created_at, updated_at) VALUES
(
  '143ff76d-5a7d-4777-9495-a53d8a2cd6a4',
  '¿Te apetece probar la cerámica?',
  'Abrimos nuevos grupos en Málaga a partir del 20 de mayo.

Plazas reducidas y grupos personalizados.

> Escríbeme y te cuento horarios disponibles
V Puedes venir con amigos o apuntarte individualmente

Reserva tu plaza ahora',
  'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/news-images/1775426524211.png',
  NULL,
  true,
  '2026-04-05 22:02:21.526+00',
  '2026-04-05 22:02:14.999096+00',
  '2026-04-05 22:02:21.527+00'
),
(
  '7de15983-2fa3-4413-bbea-2f96574e5978',
  'Nuevas clases de cerámica en Málaga ¡Reserva tu lugar!',
  'A partir del 20 de mayo, abrimos nuevos grupos de cerámica pensados para disfrutar, aprender y crear con las manos en un ambiente relajado y cercano.

Clases para peques
Por las tardes, después del cole, los niños podrán venir a experimentar con el barro, desarrollar su creatividad y pasarlo en grande mientras aprenden técnicas de modelado y torno.

Clases para adultos
También abrimos grupos por la mañana y a primera hora de la tarde, ideales para quienes buscan un momento para desconectar, aprender algo nuevo o retomar su lado creativo.

💛 Grupitos a medida
Puedes venir solo/a o formar tu propio grupo: amigos, familia o incluso planes distintos. La idea es crear un espacio cómodo y personalizado.

☕ Un plan perfecto para madres
Si tienes unas horas libres mientras los peques están en el cole, este puede ser tu momento: un espacio tranquilo para ti, para crear y disfrutar.

🌿 Edición especial pre-verano
Estas clases forman parte de una etapa previa al verano.
A partir del 20 de junio, comenzaremos con horarios de verano tipo colonia, con propuestas más intensivas y dinámicas.',
  'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/news-images/1775425753096.png',
  'https://www.instagram.com/fapottery/',
  true,
  '2026-04-05 21:50:40.288+00',
  '2026-04-05 21:50:44.575387+00',
  '2026-04-06 17:31:00.275+00'
)
ON CONFLICT (id) DO NOTHING;
