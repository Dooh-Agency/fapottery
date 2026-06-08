
-- Enum for payment method
CREATE TYPE public.payment_method AS ENUM ('stripe', 'cash');

-- Enum for reservation status
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Class types (workshops, courses, etc.)
CREATE TABLE public.class_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  max_students INTEGER NOT NULL DEFAULT 8,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scheduled class instances
CREATE TABLE public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_type_id UUID NOT NULL REFERENCES public.class_types(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  spots_available INTEGER NOT NULL DEFAULT 8,
  is_cancelled BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations
CREATE TABLE public.class_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.class_schedules(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  payment_status public.reservation_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.class_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_reservations ENABLE ROW LEVEL SECURITY;

-- Public can view active class types
CREATE POLICY "Anyone can view active class types"
  ON public.class_types FOR SELECT TO public
  USING (is_active = true);

-- Staff can manage class types
CREATE POLICY "Staff can manage class types"
  ON public.class_types FOR ALL TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

-- Public can view non-cancelled schedules
CREATE POLICY "Anyone can view available schedules"
  ON public.class_schedules FOR SELECT TO public
  USING (is_cancelled = false);

-- Staff can manage schedules
CREATE POLICY "Staff can manage schedules"
  ON public.class_schedules FOR ALL TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

-- Anyone can insert reservations (public booking)
CREATE POLICY "Anyone can create reservations"
  ON public.class_reservations FOR INSERT TO public
  WITH CHECK (true);

-- Staff can view all reservations
CREATE POLICY "Staff can view reservations"
  ON public.class_reservations FOR SELECT TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

-- Staff can update reservations
CREATE POLICY "Staff can update reservations"
  ON public.class_reservations FOR UPDATE TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

-- Staff can delete reservations
CREATE POLICY "Staff can delete reservations"
  ON public.class_reservations FOR DELETE TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

-- Function to decrement spots when reservation is confirmed
CREATE OR REPLACE FUNCTION public.handle_reservation_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.class_schedules
  SET spots_available = spots_available - 1,
      updated_at = now()
  WHERE id = NEW.schedule_id
    AND spots_available > 0;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No hay vacantes disponibles para esta clase';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_reservation_insert
  BEFORE INSERT ON public.class_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_reservation_insert();

-- Function to increment spots when reservation is cancelled
CREATE OR REPLACE FUNCTION public.handle_reservation_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.payment_status != 'cancelled' AND NEW.payment_status = 'cancelled' THEN
    UPDATE public.class_schedules
    SET spots_available = spots_available + 1,
        updated_at = now()
    WHERE id = NEW.schedule_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_reservation_cancel
  BEFORE UPDATE ON public.class_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_reservation_cancel();
