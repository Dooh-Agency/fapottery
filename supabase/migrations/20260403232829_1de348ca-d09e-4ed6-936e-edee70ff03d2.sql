
-- Create storage bucket for piece images
INSERT INTO storage.buckets (id, name, public) VALUES ('piece-images', 'piece-images', true);

-- Anyone can view piece images
CREATE POLICY "Anyone can view piece images" ON storage.objects
  FOR SELECT USING (bucket_id = 'piece-images');

-- Staff can upload piece images
CREATE POLICY "Staff can upload piece images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'piece-images' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'))
  );

-- Staff can update piece images
CREATE POLICY "Staff can update piece images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'piece-images' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'))
  );

-- Staff can delete piece images
CREATE POLICY "Staff can delete piece images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'piece-images' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'colaborador'))
  );
