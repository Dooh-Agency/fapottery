-- Track how much was actually charged on a class reservation (deposit, not full price)
ALTER TABLE public.class_reservations
  ADD COLUMN amount_paid NUMERIC(10,2);

-- Orders for piece purchases (tienda)
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'cancelled');

CREATE TABLE public.piece_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piece_id UUID NOT NULL REFERENCES public.pieces(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount NUMERIC(10,2) NOT NULL,
  customer_email TEXT,
  status public.order_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.piece_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view orders"
  ON public.piece_orders FOR SELECT TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));

-- Gift cards
CREATE TYPE public.gift_card_status AS ENUM ('pending', 'active', 'redeemed', 'cancelled');

CREATE TABLE public.gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  balance NUMERIC(10,2) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_email TEXT,
  message TEXT,
  status public.gift_card_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  redeemed_at TIMESTAMPTZ
);

ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage gift cards"
  ON public.gift_cards FOR ALL TO public
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'));
