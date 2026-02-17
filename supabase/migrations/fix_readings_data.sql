-- FIX SCRIPT: Run this in Supabase SQL Editor to RESET Readings structure and Populate Data

-- 1. DROP and RECREATE Table (to match consumption page expectations if schema changed)
DROP TABLE IF EXISTS readings;

CREATE TABLE readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supply_id UUID REFERENCES supplies(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reading_date DATE NOT NULL,
    f1 NUMERIC(10, 2) DEFAULT 0,
    f2 NUMERIC(10, 2) DEFAULT 0,
    f3 NUMERIC(10, 2) DEFAULT 0,
    source TEXT DEFAULT 'auto', -- 'auto', 'manual', 'estimated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own readings" ON readings FOR DELETE USING (auth.uid() = user_id);

-- 2. SEED DATA
DO $$
DECLARE
    target_user_id UUID;
    supply_id_val UUID;
BEGIN
    -- Get the most recently created user
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'No user found in auth.users.';
    END IF;

    -- Get the supply
    SELECT id INTO supply_id_val FROM supplies WHERE user_id = target_user_id LIMIT 1;

    IF supply_id_val IS NULL THEN
        RAISE EXCEPTION 'No supply found. Run fix_invoices_data.sql first.';
    END IF;

    -- Insert Real Reading (Dec 2025 - 571 kWh)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (
        supply_id_val,
        target_user_id,
        '2025-12-31',
        200, -- F1
        180, -- F2
        191, -- F3 = Total 571
        'auto'
    );

    -- Insert History (Nov 2025 - 520 kWh)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_id_val, target_user_id, '2025-11-30', 180, 160, 180, 'auto');
    
    -- Insert History (Oct 2025 - 480 kWh)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_id_val, target_user_id, '2025-10-31', 170, 150, 160, 'manual');

    -- Insert History (Sep 2025 - 450 kWh)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_id_val, target_user_id, '2025-09-30', 160, 140, 150, 'auto');

    -- Insert History (Aug 2025 - 400 kWh) -- Low consumption
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_id_val, target_user_id, '2025-08-31', 200, 100, 100, 'auto');

     -- Insert History (Jan 2026 - Partial)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_id_val, target_user_id, '2026-01-31', 100, 80, 90, 'estimated');

END $$;
