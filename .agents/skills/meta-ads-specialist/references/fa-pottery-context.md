# Contexto de FA Pottery para Meta Ads

Revalidar estos datos contra el sitio, el CMS y la operación antes de usarlos. La fotografía técnica fue revisada el 15 de julio de 2026.

## Negocio y posicionamiento

- FA Pottery Studio es la marca personal de Florencia Alvarez: cerámica funcional y contemporánea, producción artesanal, enseñanza y colaboraciones.
- La propuesta combina oficio, diseño, proceso manual y acompañamiento cercano. La voz debe sentirse humana, cálida y precisa; no corporativa ni grandilocuente.
- El sitio comunica actividad en Málaga y Buenos Aires, pero la home y las reservas visibles priorizan Málaga. No mezclar mercados, monedas, teléfonos o disponibilidad.
- Los productos comerciales principales son:
  - actividades: clases regulares, workshops y clases personalizadas;
  - tienda: piezas únicas o series pequeñas;
  - colaboraciones: talleres, empresas, estudios, centros culturales y team building.

## Embudos visibles en el repositorio

- Home: `/` y `/en/`.
- Actividades: `/actividades` y `/actividades/:id`, con reserva por WhatsApp.
- Tienda: `/tienda` y `/tienda/:id`, con consulta por WhatsApp.
- Colaboraciones: `/colaboraciones`.
- Landing de campaña: `/breakfast-and-paint`, orientada a una reserva por WhatsApp.
- Existe una ruta `/fa` todavía presentada como landing promocional futura.

La landing `breakfast-and-paint` contiene una fecha y una oferta específicas. Verificar año, vigencia y plazas en el CMS/operación; la presencia de una ruta no significa que el evento siga disponible.

## Medición observada

- `src/lib/analytics.ts` carga Google Tag Manager con el contenedor `GTM-N7HF8BTQ` y expone `trackEvent`.
- No se encontraron llamadas a `trackEvent` en las páginas públicas revisadas.
- No se encontró una instalación directa del Meta Pixel en el código. El Pixel podría estar configurado dentro del contenedor remoto de GTM; confirmarlo en GTM y Events Manager.
- Los clics a WhatsApp son enlaces `wa.me` con texto precargado. Un clic no demuestra una conversación, una reserva ni un cobro.
- Supabase contiene reservas de clases y funciones de checkout de Stripe, pero las páginas públicas revisadas cierran actividades y piezas por WhatsApp. Confirmar el flujo operativo actual antes de diseñar eventos de compra.

## Medición recomendada a validar

Mantener una taxonomía estable en `dataLayer` y pasar sólo datos permitidos. Como punto de partida:

| Momento | Evento interno sugerido | Uso |
|---|---|---|
| Vista de actividad/pieza | `view_item` | Diagnóstico y remarketing |
| Selección de fecha/opción | `select_item_option` | Fricción previa al CTA |
| Clic a WhatsApp | `generate_lead_whatsapp` | Proxy, no venta |
| Reserva creada | `reservation_created` | Lead operativo |
| Reserva confirmada/pagada | `purchase` o evento equivalente | Resultado comercial |
| Compra de pieza cobrada | `purchase` | Resultado comercial |

No enviar texto libre de WhatsApp ni información personal a analytics. Si Pixel y Conversions API envían el mismo evento, usar identificadores coherentes para deduplicar. Implementar consentimiento y tratamiento de datos acorde al mercado antes de activar seguimiento publicitario.

## Convención UTM sugerida

Usar minúsculas, sin tildes y con valores estables:

```text
utm_source={{site_source_name}}
utm_medium=paid_social
utm_campaign=<mercado>_<oferta>_<objetivo>_<aaaamm>
utm_content=<concepto>_<formato>_<variante>
utm_term=<audiencia>
```

Guardar también una identificación humana de campaña, conjunto y anuncio en el registro de leads/reservas cuando sea viable.

## Restricciones económicas y operativas

- Las actividades tienen aforo y fecha: optimizar ocupación rentable, no volumen ilimitado.
- La tienda trabaja con stock pequeño o piezas únicas: evitar seguir promocionando inventario agotado.
- Las conversaciones dependen del seguimiento humano: medir tiempo de primera respuesta, calificación y cierre.
- Confirmar margen, impuestos, comisiones, materiales, cocción, alquiler/colaborador y cancelaciones antes de fijar CPA objetivo.
