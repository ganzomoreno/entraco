-- Reset table to ensure clean state
DROP TABLE IF EXISTS readings;

-- Create readings table
CREATE TABLE readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supply_id UUID REFERENCES supplies(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reading_date DATE NOT NULL,
    value NUMERIC(10, 2) NOT NULL, -- kWh or Smc
    is_estimated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policies (Standard SQL, no complex blocks)
CREATE POLICY "Users can view their own readings" ON readings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own readings" ON readings FOR DELETE USING (auth.uid() = user_id);

-- SEED DATA SCRIPT
DO $$
DECLARE
    s_rec RECORD;
    i INT;
    r_date DATE;
    r_val NUMERIC;
    u_id UUID;
BEGIN
    FOR s_rec IN SELECT id, user_id, service_type FROM supplies LOOP
        u_id := s_rec.user_id; 
        
        -- Generate 12 months of data
        FOR i IN 0..11 LOOP
            r_date := (NOW() - (i || ' month')::INTERVAL)::DATE;
            
            IF s_rec.service_type = 'electricity' THEN
                r_val := floor(random() * 300 + 100);
            ELSE
                r_val := floor(random() * 80 + 20);
            END IF;

            INSERT INTO readings (supply_id, user_id, reading_date, value, is_estimated)
            VALUES (s_rec.id, u_id, r_date, r_val, (random() < 0.2));
        END LOOP;
    END LOOP;
END $$;
