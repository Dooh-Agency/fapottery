-- Las clases regulares combinan una regla semanal con fechas concretas para
-- que las clases sueltas puedan reservarse sin perder el control de cupos.
ALTER TABLE public.class_types
  ADD COLUMN IF NOT EXISTS recurring_schedules JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS class_schedules_unique_occurrence
  ON public.class_schedules (class_type_id, scheduled_date, start_time);
