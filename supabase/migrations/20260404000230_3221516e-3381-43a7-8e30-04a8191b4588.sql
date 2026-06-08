
DROP POLICY "Anyone can create reservations" ON public.class_reservations;

CREATE POLICY "Anyone can create reservations"
  ON public.class_reservations FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.class_schedules
      WHERE id = schedule_id
        AND is_cancelled = false
        AND spots_available > 0
    )
  );
