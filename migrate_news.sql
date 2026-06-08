INSERT INTO news (id, title, body, image_url, instagram_url, is_published, published_at, created_at, updated_at) VALUES
(
  '143ff76d-5a7d-4777-9495-a53d8a2cd6a4',
  '¿Te apetece probar la cerámica?',
  E'Abrimos nuevos grupos en Málaga a partir del 20 de mayo.\n\nPlazas reducidas y grupos personalizados.\n\n> Escríbeme y te cuento horarios disponibles\nV Puedes venir con amigos o apuntarte individualmente\n\nReserva tu plaza ahora',
  'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/news-images/1775426524211.png',
  NULL, true, '2026-04-05 22:02:21.526+00', '2026-04-05 22:02:14.999096+00', '2026-04-05 22:02:21.527+00'
),
(
  '7de15983-2fa3-4413-bbea-2f96574e5978',
  'Nuevas clases de cerámica en Málaga ¡Reserva tu lugar!',
  E'A partir del 20 de mayo, abrimos nuevos grupos de cerámica pensados para disfrutar, aprender y crear con las manos en un ambiente relajado y cercano.\n\nClases para peques\nPor las tardes, después del cole, los niños podrán venir a experimentar con el barro, desarrollar su creatividad y pasarlo en grande mientras aprenden técnicas de modelado y torno.\n\nClases para adultos\nTambién abrimos grupos por la mañana y a primera hora de la tarde, ideales para quienes buscan un momento para desconectar, aprender algo nuevo o retomar su lado creativo.\n\n💛 Grupitos a medida\nPuedes venir solo/a o formar tu propio grupo: amigos, familia o incluso planes distintos. La idea es crear un espacio cómodo y personalizado.\n\n☕ Un plan perfecto para madres\nSi tienes unas horas libres mientras los peques están en el cole, este puede ser tu momento: un espacio tranquilo para ti, para crear y disfrutar.\n\n🌿 Edición especial pre-verano\nEstas clases forman parte de una etapa previa al verano.\nA partir del 20 de junio, comenzaremos con horarios de verano tipo colonia, con propuestas más intensivas y dinámicas.',
  'https://kyodyanhbflqmmlrnvht.supabase.co/storage/v1/object/public/news-images/1775425753096.png',
  'https://www.instagram.com/fapottery/', true, '2026-04-05 21:50:40.288+00', '2026-04-05 21:50:44.575387+00', '2026-04-06 17:31:00.275+00'
)
ON CONFLICT (id) DO NOTHING;
