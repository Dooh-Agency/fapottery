# Continuidad — Breakfast & Paint · 1 de agosto de 2026

Registro de la conversación de planificación, implementación y despliegue para
retomar la campaña en otro chat sin perder decisiones ni contexto.

Última actualización: 21 de julio de 2026.

## 1. Oferta confirmada

| Campo | Definición |
|---|---|
| Evento | Breakfast & Paint |
| Fecha | Sábado 1 de agosto de 2026 |
| Horario | 11:00–13:00 h |
| Lugar | Maui Paddle Surf, Playa Butibamba, La Cala de Mijas |
| Capacidad | 16 plazas |
| Precio | 45 € por persona |
| Incluye | Set de desayuno de cerámica, materiales, desayuno, cocción y acabado |
| Reserva | Contacto por WhatsApp y transferencia del 50% (22,50 €) para confirmar la plaza |

La oferta reutiliza las características de la edición anterior. Las fuentes de
contenido son la landing anterior `/breakfast-and-paint` y la actividad
`/actividades/56fbca84-e350-4738-a57f-9d6be48501cf`.

## 2. Resultado de la campaña anterior

Datos observados de la campaña de tráfico de la edición anterior:

| Métrica | Resultado |
|---|---:|
| Visualizaciones | 19.787 |
| Alcance | 15.740 personas |
| Visitas a la landing | 205 |
| Gasto | ARS 66.510,15 |
| Coste estimado por visita | ARS 324 |
| Reservas confirmadas reportadas | 0 |

### Conclusión operativa

La pauta consiguió visitas, pero no reservas confirmadas. No se debe repetir una
campaña optimizada sólo a tráfico. El cuello de botella se ubicó después del clic:
claridad de la reserva, CTA, seguimiento por WhatsApp y señal de pago.

## 3. Decisión de embudo para la nueva campaña

```text
Reel/anuncio → landing específica → formulario → WhatsApp →
transferencia de 22,50 € → plaza confirmada
```

### Conversión y medición

- Conversión publicitaria primaria: envío del formulario de reserva.
- Señales diagnósticas: clics, visitas, formularios enviados y conversaciones de
  WhatsApp.
- Resultado comercial: transferencia recibida y plaza confirmada.
- No escalar gasto por CTR, reproducciones o clics; sólo por reservas reales.
- Responder las consultas de WhatsApp idealmente en menos de 10 minutos.

Mensaje base de seguimiento:aho

> ¡Hola, [nombre]! Qué alegría que quieras sumarte a Breakfast & Paint del 1 de agosto. La plaza se confirma con una transferencia de 22,50 € (el 50% del valor). Cuando me envíes el comprobante, te confirmo la reserva y te paso todos los detalles. ¿Te envío los datos?

### Estructura propuesta de Meta Ads

- Objetivo: Leads hacia la landing, no Traffic.
- Público: mercado local en torno a La Cala de Mijas; mantener una estructura
  simple con presupuesto pequeño.
- Creatividades: dos anuncios en el mismo conjunto, sin fragmentar aún por
  remarketing (el público histórico de 205 visitas es pequeño).
- Verificar en GTM/Meta Events Manager que `generate_lead_event_interest` se
  reciba antes de optimizar por ese evento.
- Presupuesto: pendiente de definir por Florencia. El CPA máximo debe calcularse
  sobre margen por plaza, no sobre CPC.

## 4. Brief de creatividad

Florencia está armando un Reel distinto del flyer anterior. Concepto recomendado:

1. Manos pintando una taza o bandeja: “Tu desayuno, pintado por ti”.
2. Café, frutas, playa y personas creando.
3. Set terminado: “Materiales, desayuno y cocción incluidos”.
4. Cierre: “Breakfast & Paint · 1 de agosto · 11–13 h · La Cala de Mijas · 45 €”.
5. CTA: “Reserva con 22,50 €”.

Copy propuesto:

> Una mañana para pintar tu propio set de desayuno, desayunar a pasos del mar y llevártelo a casa después de la cocción.
>
> Sábado 1 de agosto · 11–13 h
> Maui Paddle Surf · La Cala de Mijas
> 45 € · incluye set, materiales, desayuno, cocción y acabado.
>
> Reserva tu plaza con un anticipo de 22,50 €. No hace falta experiencia previa.

## 5. Landing nueva implementada

Se creó una landing independiente, sin modificar la landing de la edición
anterior:

- Ruta: `/breakfast-and-paint-agosto`
- Componente: `src/pages/BreakfastPaintAugust.tsx`
- Registro de ruta: `src/App.tsx`
- Textos en español e inglés: `src/i18n/locales/{es,en}.json`
- SEO y metadatos propios para la edición del 1 de agosto.

La landing comunica 16 plazas, precio de 45 €, anticipo de 22,50 €, ubicación,
horario, inclusiones y CTA de reserva. El CTA abre el formulario existente y el
registro crea el lead antes de derivar a WhatsApp.

También se actualizaron los textos del diálogo de leads para usar lenguaje de
reserva (“Empezá tu reserva”) en vez de “lista de interés”.

## 6. Correcciones del backoffice implementadas

Se atendió el reporte de que al editar una actividad a veces no se podía guardar.

Cambios realizados:

1. Si el formulario tiene validaciones pendientes, muestra un aviso y desplaza el
   foco al primer campo inválido; antes podía parecer que el botón no respondía.
2. Las actualizaciones de actividades y horarios solicitan la fila modificada a
   Supabase (`select().single()`), evitando mostrar éxito si RLS o una sesión
   impiden que se afecte una fila.
3. En “Editar clase”, las fechas existentes ahora tienen un botón de lápiz y se
   pueden modificar sin borrarlas.

Archivos principales:

- `src/components/backoffice/ClassTypeFormDialog.tsx`
- `src/hooks/useClasses.ts`

Verificación realizada: `npm run test` y `npm run build` correctos. El lint global
mantiene errores preexistentes ajenos a este cambio.

## 7. Estado de despliegue: Cloudflare Pages

### Hechos comprobados

- La producción `https://fapottery.com/breakfast-and-paint-agosto` estaba
  devolviendo la página 404 del build anterior.
- El commit con la landing y las correcciones fue subido a GitHub en un momento de
  la conversación, pero no llegó a la producción actual.
- Cloudflare es el hosting vigente; Netlify ya no se usa por falta de crédito.
- En Cloudflare Pages, proyecto `fapottery-web`, el último deploy de producción
  visible tenía 4 días de antigüedad.
- En **Settings → Build**, el campo **Git repository** mostraba `Connect`.
  Esto significa que Pages no está conectado a GitHub y, por tanto, un push no
  genera deployments automáticos.

### Próximo paso para publicar

La opción más inmediata es un deploy manual en Cloudflare Pages:

1. Abrir `Workers & Pages → fapottery-web`.
2. Pulsar **Create deployment**.
3. Subir el contenido construido de `dist/` (o un ZIP generado a partir de esa
   carpeta, si Cloudflare lo solicita).
4. Esperar el estado exitoso y comprobar la URL pública.

No usar el menú de tres puntos de un deployment viejo para reintentar, porque
volvería a publicar el build anterior.

Como mejora posterior, conectar `Dooh-Agency/fapottery` a Cloudflare Pages y dejar
`main` como rama de producción para que cada push futuro se publique de forma
automática.

## 8. Precauciones y pendientes para el próximo chat

- Confirmar el presupuesto total de Meta Ads antes de recomendar importes,
  umbrales de pausa o escalado.
- Verificar el Pixel/GTM y el evento de lead antes de publicar una campaña
  optimizada a conversiones.
- Realizar y verificar el deploy manual de Cloudflare antes de usar la nueva URL
  en anuncios.
- No asumir que la landing está publicada hasta comprobar que la ruta pública no
  muestra 404.
- El repositorio puede contener archivos locales no relacionados (`.claude/`, ZIPs
  de deploy y `supabase/.temp/`); no incluirlos en commits sin revisión explícita.

---

## Actualización prioritaria — 22 de julio de 2026

Esta sección prevalece sobre las recomendaciones anteriores de este documento
cuando exista una contradicción.

### Estado comercial y de contenido

- Florencia publicó el Reel de la nueva edición en Instagram, con recordatorio y
  la portada final que muestra el set de cerámica pintado, precio de 45 € y
  reserva de 22,50 €.
- El enlace principal de la bio apunta a
  `https://fapottery.com/breakfast-and-paint-agosto`.
- La landing no debe ser un requisito para llegar a WhatsApp desde el anuncio:
  en la campaña la prioridad es facilitar conversaciones de reserva.
- La landing se mantiene como fuente de información y de captación de email para
  el tráfico orgánico de la bio. El consentimiento de novedades es opcional y
  separado de la reserva.

### Decisión estratégica vigente

La campaña ideal es:

```text
Reel existente → mensaje nativo de WhatsApp → anticipo de 22,50 € → plaza confirmada
```

El evento es inminente y el resultado anterior fue 205 visitas a la landing sin
reservas reportadas. Por ese motivo no se repetirá una campaña cuyo objetivo sea
sólo tráfico a la landing.

#### Bloqueo actual de WhatsApp nativo en Meta

- El número comercial deseado es **+34 681 816 030**.
- Meta no permite todavía conectarlo como destino nativo de mensajes porque la
  cuenta de Florencia tiene una verificación de seguridad pendiente.
- El teléfono argentino **+54 11 5311 7744** está configurado como método de
  autenticación en dos pasos. **No eliminarlo** hasta sustituirlo por un método
  nuevo y verificado.
- El Centro de cuentas indicó que el cambio de seguridad está bloqueado porque
  considera el dispositivo actual no habitual. Meta no mostró un plazo concreto;
  dejar la sesión iniciada y reintentar desde el mismo dispositivo pasadas al
  menos 24 horas, sin repetir intentos hoy.
- No recuperar ni modificar cuentas de terceros. Florencia está conectada con su
  propio perfil de Facebook; los nombres de otros usuarios que aparecen en el
  portfolio no son parte de la tarea.

#### Decisión operativa si la campaña debe activarse antes del desbloqueo

La alternativa de lanzamiento inmediata, aprobada como recomendación final por
la urgencia, es usar el Reel con un destino web que abre WhatsApp directamente:

```text
https://wa.me/34681816030?text=Hola%2C%20quiero%20reservar%20una%20plaza%20para%20PAINT%20%26%20BREAKFAST%20del%201%20de%20agosto.%20%C2%BFC%C3%B3mo%20confirmo%20mi%20reserva%3F
```

Configuración prevista para ese caso:

- Objetivo: **Tráfico**.
- Destino: **Sitio web** (enlace `wa.me`).
- Creativo: Reel existente.
- CTA: **Reservar** o **Más información**, según la opción disponible.
- Segmentación: zona local de La Cala de Mijas, no Málaga capital.

Limitación conocida: Meta optimizará para clics al enlace, no para conversaciones
de WhatsApp iniciadas. Aun así, el usuario llega al WhatsApp español con el texto
de reserva preescrito. Cuando se pueda conectar WhatsApp de forma nativa, se
puede duplicar/sustituir esta versión por una campaña de mensajes; no se pierde el
Reel ni el trabajo creativo.

**No se ha creado, publicado ni activado aún la campaña nueva.** El siguiente
agente debe pedir el presupuesto total antes de llegar al paso de publicación y
confirmar explícitamente con Florencia justo antes de generar gasto.

### Medición, retargeting y cuentas de Meta

- Cuenta publicitaria que se estaba usando: `FA Pottery (575814233209737)`.
- Portfolio comercial: `440811599928100`.
- En el Administrador de eventos de esa cuenta aparecía "Conectar datos" y no se
  confirmó ninguna fuente de datos/píxel utilizable. No afirmar que el píxel ni el
  evento de lead estén configurados.
- Los datos históricos (205 visitas) pertenecen a la campaña anterior y no se ha
  confirmado que puedan utilizarse para retargeting en la cuenta actual. No crear
  ni prometer una audiencia de remarketing hasta verificar el píxel/dataset.
- La cuenta mostró mensajes de preparación para publicar la primera campaña;
  comprobar método de pago y estado antes de publicar.

### Producción web: estado confirmado

La versión pública fue publicada y comprobada el 22 de julio de 2026:

- URL: `https://fapottery.com/breakfast-and-paint-agosto`
- La página muestra **16 plazas**, no 18.
- Textos en español de España: "Empieza", "Deja", "Reserva"; no usar voseo.
- El formulario de reserva captura nombre/email y consentimiento opcional; luego
  prepara el mensaje de WhatsApp de reserva.
- La construcción `npm run build` pasó correctamente antes de publicar.
- Hosting vigente: proyecto Cloudflare Pages **`fapottery-git`**, conectado a
  `Dooh-Agency/fapottery`, con despliegues automáticos desde `main`; el dominio
  `fapottery.com` apunta a ese proyecto.
- Commit publicado en `main`: `525b0f0` (`fix: optimize breakfast paint booking copy`).

### Mejoras solicitadas para el próximo lote de web (NO implementadas ni publicadas)

1. En la imagen del workshop, sustituir la taza por el set completo de cerámica
   subido al backoffice:
   `https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/1784736703353.png`
2. Usar en toda la web el nombre exacto **PAINT & BREAKFAST**, en ese orden y en
   mayúsculas.
3. Florencia pidió borrar registros para hacer pruebas, pero no terminó de
   especificar cuáles. Antes de eliminar datos, preguntar si se refiere a leads
   de formulario, actividades, horarios u otro registro concreto.
4. En el backoffice, permitir añadir enlaces en los detalles de actividades y
   renderizarlos como enlaces clicables en el sitio público.
5. Rediseñar galerías: sin fondo en miniaturas ni imagen grande; alinear la fila
   de miniaturas arriba respecto de la imagen grande; ocultar el excedente cuando
   supere la altura de la foto grande y mostrar una flecha pequeña de navegación.
6. Agrupar estas mejoras en una próxima publicación para no consumir créditos en
   varios despliegues pequeños.
