-- Add Cadastral Data fields to supplies table
ALTER TABLE supplies 
ADD COLUMN IF NOT EXISTS activation_date DATE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
ADD COLUMN IF NOT EXISTS cadastral_section TEXT,
ADD COLUMN IF NOT EXISTS cadastral_sheet TEXT,
ADD COLUMN IF NOT EXISTS cadastral_parcel TEXT,
ADD COLUMN IF NOT EXISTS cadastral_subordinate TEXT,
ADD COLUMN IF NOT EXISTS cadastral_followup TEXT,
ADD COLUMN IF NOT EXISTS cadastral_type TEXT, -- e.g. Urbano, Terreno
ADD COLUMN IF NOT EXISTS cadastral_category TEXT; -- e.g. A/2, C/6

-- Update RLS to ensure users can update these fields (already covered by existing policy, but good to verify)
