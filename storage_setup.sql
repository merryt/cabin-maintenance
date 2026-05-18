-- Add photo storage fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE appliances ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE maintenance_logs ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for cabin-photos
INSERT INTO storage.buckets (id, name, public) VALUES ('cabin-photos', 'cabin-photos', true) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Authenticated users can upload photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'cabin-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'cabin-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'cabin-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Public read access for photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'cabin-photos');
