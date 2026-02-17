-- FIX SCRIPT: Run this to ADD a Gas Supply and Data

DO $$
DECLARE
    target_user_id UUID;
    gas_supply_id UUID;
BEGIN
    -- 1. Get user
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF target_user_id IS NULL THEN RAISE EXCEPTION 'No user found'; END IF;

    -- 2. Create GAS Supply if not exists
    SELECT id INTO gas_supply_id FROM supplies WHERE user_id = target_user_id AND service_type = 'gas' LIMIT 1;

    IF gas_supply_id IS NULL THEN
        INSERT INTO supplies (user_id, pod, nickname, service_type, address)
        VALUES (target_user_id, 'IT002G987654321', 'Casa al Mare (Gas)', 'gas', 'Via del Mare 22, Genova')
        RETURNING id INTO gas_supply_id;
    END IF;

    -- 3. Insert Gas Readings (Single Value logic -> using F1/Total logic)
    -- For Gas, we usually just need a 'Total' or 'F1'. Let's use F1 as the main value column.
    DELETE FROM readings WHERE supply_id = gas_supply_id;

    -- Dec 2025
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (gas_supply_id, target_user_id, '2025-12-31', 120, 0, 0, 'auto'); -- 120 Smc

    -- Nov 2025
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (gas_supply_id, target_user_id, '2025-11-30', 100, 0, 0, 'auto');

    -- Oct 2025 (Manual)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (gas_supply_id, target_user_id, '2025-10-31', 80, 0, 0, 'manual');

    -- 4. Insert Gas Invoice
    DELETE FROM invoices WHERE supply_id = gas_supply_id;

    INSERT INTO invoices (
        user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end
    ) VALUES (
        target_user_id,
        gas_supply_id,
        'GAS-2026/001',             
        '2026-01-15',           
        '2026-01-30',          
        85.50,                 
        'unpaid',             
        'gas',
        120, -- This field is named consumption_kwh but effectively holds the consumption value (Smc for gas)                   
        '2025-12-01',           
        '2025-12-31'
    );

END $$;
