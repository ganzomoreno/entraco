-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
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

-- SEED DATA SCRIPT
DO $$
DECLARE
    s_rec RECORD;
    i INT;
    inv_date DATE;
    due_date DATE;
    amount NUMERIC;
    status TEXT;
    inv_num TEXT;
BEGIN
    FOR s_rec IN SELECT id, user_id, service_type FROM supplies LOOP
        -- Real Invoice from User (Dec 2025)
        INSERT INTO invoices (
            user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end, pdf_url
        ) VALUES (
            s_rec.user_id,
            s_rec.id,
            '2026/001',             -- Invoice Number
            '2026-01-10',           -- Issue Date (Approx)
            '2026-01-26',           -- Due Date (Real)
            158.40,                 -- Amount (Real)
            'unpaid',               -- Status (Assumed unpaid or make it paid?) Let's say unpaid for better UI
            s_rec.service_type,
            571,                    -- Consumption (Real)
            '2025-12-01',           -- Period Start
            '2025-12-31',           -- Period End
            '/fattura_esempio.pdf'  -- Link to the public file
        );

        -- Add a couple of older random paid invoices for history
        FOR i IN 1..3 LOOP
             inv_date := ('2025-12-01'::DATE - (i || ' month')::INTERVAL)::DATE;
             INSERT INTO invoices (
                user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end
            ) VALUES (
                s_rec.user_id,
                s_rec.id,
                extract(year from inv_date) || '/' || lpad((floor(random() * 1000)::text), 4, '0'),
                inv_date,
                (inv_date + '20 days'::INTERVAL)::DATE,
                floor(random() * 100 + 40),
                'paid',
                s_rec.service_type,
                floor(random() * 200 + 100),
                (inv_date - '1 month'::INTERVAL)::DATE,
                inv_date
            );
        END LOOP;
    END LOOP;
END $$;
