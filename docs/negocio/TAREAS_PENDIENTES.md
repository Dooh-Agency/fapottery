# Tareas pendientes — FA Pottery

> Lista operativa compartida para Florencia y agentes de IA.
>
> Última actualización: 6 de agosto de 2026.
> Regla: no marcar una tarea como hecha hasta comprobar el resultado en la
> plataforma o sitio público correspondiente.

## PAINT & BREAKFAST — descartado

El evento y sus campañas/landings asociados quedan cancelados. No retomar, publicar
ni medir tareas relacionadas salvo que Florencia lo solicite expresamente en el futuro.
La documentación de continuidad se conserva sólo como registro histórico.

## Backoffice — mejoras pendientes

- [x] Clases regulares: permitir cargar varias sedes, cada una con nombre/zona y
  enlace opcional a Google Maps; mostrarlas correctamente en la ficha pública.
- [x] Novedades: incorporar edición enriquecida del contenido, equivalente a
  Clases: negritas, bloques destacados y enlaces clicables en el detalle público.
- [x] Novedades: permitir una galería de fotos adicional y mostrarla en la ficha
  pública con la misma experiencia de navegación que las actividades.

## Pendientes generales de publicación

- [ ] Confirmar qué registros quiere borrar para pruebas antes de eliminar datos.
  No borrar leads, actividades ni horarios sin esa precisión.
- [ ] Ejecutar validaciones, publicar el lote y comprobar producción después del
  despliegue. En curso: lote de acceso, favicon y consentimiento de cookies.

## RRSS y estrategia de comunicación

Documentación y materiales de trabajo: [`docs/negocio/rrss/`](rrss/README.md).

- [ ] Preparar la caja de contenido y realizar la primera sesión doméstica de
  fotos y vídeos: arcilla, herramientas, piezas, mesa, luz y planos de apoyo.
- [ ] Producir las primeras cuatro piezas del calendario: `Materia, luz y manos`,
  `Así es tu primera clase`, `No busco piezas iguales` y `La mesa en uso`.
- [ ] Confirmar permiso de imagen, créditos, etiquetas y destino de consultas
  antes de publicar contenido gastronómico de locales o piezas de Kanso.
- [ ] Confirmar fecha, plazas, precio, enlace/WhatsApp y capacidad antes de
  activar las publicaciones BOFU de clases, workshops o encargos.
- [ ] Revisar Insights el 5 de septiembre: alcance de no seguidores, guardados,
  compartidos, mensajes cualificados y reservas/ventas atribuibles.
- [ ] Definir canal de consultas, logística, precios y condiciones de Kanso para
  Argentina; crear o enlazar la documentación propia de Kanso cuando esté lista.

## Próximo lote de cambios

- [x] Añadir página bilingüe de política de cookies y enlaces desde el pie de
  página.
- [x] Implementar consentimiento de cookies para España/UE:
  - Banner inicial antes de cargar etiquetas no esenciales, con "Aceptar",
    "Rechazar" y "Configurar" igualmente visibles.
  - Configuración por categorías: necesarias (siempre activas), analítica y
    marketing; estas dos últimas solo tras consentimiento explícito.
  - Bloquear GTM, Meta Pixel, Google Analytics y demás etiquetas de marketing
    cuando no exista consentimiento o se hayan rechazado.
  - Guardar y permitir retirar o modificar la elección desde un enlace fijo
    "Configurar cookies" en el footer.
  - Actualizar `/cookies` en español e inglés con categorías, finalidades,
    proveedores y forma de retirar el consentimiento.
  - Evitar mapas de Google incrustados antes del consentimiento; mostrar en su
    lugar un enlace o botón "Ver mapa" hacia Google Maps.
  - Mantener diseño e idiomas actuales y comprobar el funcionamiento tras
    publicarlo. Verificado localmente el 6 de agosto de 2026; pendiente de
    comprobación final en producción.
- [ ] Permitir borrar registros creados para pruebas, una vez identificados los
  tipos de registro y los elementos concretos que se pueden eliminar.
- [x] Backoffice: habilitar el borrado con confirmación de reservas y
  preinscripciones de eventos, sin eliminar datos automáticamente.
- [x] Tarjetas de actividades: cuando una actividad tenga más de un precio,
  mostrar en el bloque inferior "Desde €X" con el importe más bajo. Si tiene un
  único precio, mantener la visualización actual.
