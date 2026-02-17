-- FIX SCRIPT: Run this in Supabase SQL Editor to RECREATE the table and seed data

-- 1. DROP and RECREATE Table to fix "column does not exist" errors
DROP TABLE IF EXISTS invoices;

CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    supply_id UUID REFERENCES supplies(id) ON DELETE SET NULL, -- Optional (e.g. multi-supply invoice)
    number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('paid', 'unpaid', 'overdue')) DEFAULT 'unpaid',
    type TEXT CHECK (type IN ('electricity', 'gas', 'other')) DEFAULT 'electricity',
    consumption_kwh INTEGER, -- Cached consumption value for display
    period_start DATE,
    period_end DATE,
    pdf_url TEXT, -- In a real app, this would be a bucket path
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invoices" ON invoices FOR UPDATE USING (auth.uid() = user_id);


-- 2. SEED DATA for the current user
DO $$
DECLARE
    target_user_id UUID;
    supply_id_val UUID;
BEGIN
    -- Get the most recently created user (likely you)
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'No user found in auth.users. Please sign up first.';
    END IF;

    -- Check if this user has a supply, if not create one
    SELECT id INTO supply_id_val FROM supplies WHERE user_id = target_user_id LIMIT 1;

    IF supply_id_val IS NULL THEN
        INSERT INTO supplies (user_id, pod, nickname, service_type, address)
        VALUES (target_user_id, 'IT001E123456789', 'Casa Principale', 'electricity', 'Via Roma 1, Milano')
        RETURNING id INTO supply_id_val;
    END IF;

    -- Insert the Real Invoice (Dec 2025)
    INSERT INTO invoices (
        user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end, pdf_url
    ) VALUES (
        target_user_id,
        supply_id_val,
        '2026/001',             
        '2026-01-10',           
        '2026-01-26',          
        158.40,                 
        'unpaid',             
        'electricity',
        571,                    
        '2025-12-01',           
        '2025-12-31',           
        '/fattura_esempio.pdf'  
    );

    -- Add some history (Paid invoices)
    INSERT INTO invoices (
        user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end
    ) VALUES 
    (target_user_id, supply_id_val, '2025/112', '2025-11-10', '2025-11-30', 145.20, 'paid', 'electricity', 520, '2025-10-01', '2025-10-31'),
    (target_user_id, supply_id_val, '2025/098', '2025-09-10', '2025-09-30', 130.50, 'paid', 'electricity', 480, '2025-08-01', '2025-08-31');

END $$;
