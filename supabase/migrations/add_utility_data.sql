-- Add customer_code to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS customer_code TEXT;

-- Create supplies table
CREATE TABLE IF NOT EXISTS supplies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pod TEXT NOT NULL,
    nickname TEXT, -- e.g. "Casa al mare"
    service_type TEXT CHECK (service_type IN ('electricity', 'gas')) DEFAULT 'electricity',
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for supplies
ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own supplies" 
ON supplies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own supplies" 
ON supplies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplies" 
ON supplies FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supplies" 
ON supplies FOR DELETE 
USING (auth.uid() = user_id);
