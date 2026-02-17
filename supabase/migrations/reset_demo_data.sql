-- MASTER RESET SCRIPT: Run this to create a COHERENT Demo State (1 Home, 2 Supplies)

DO $$
DECLARE
    target_user_id UUID;
    supply_elec_id UUID;
    supply_gas_id UUID;
BEGIN
    -- 1. Get user
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    IF target_user_id IS NULL THEN RAISE EXCEPTION 'No user found'; END IF;

    -- 2. CLEANUP (Delete everything for this user to start fresh)
    DELETE FROM readings WHERE user_id = target_user_id;
    DELETE FROM invoices WHERE user_id = target_user_id;
    DELETE FROM supplies WHERE user_id = target_user_id;

    -- 3. CREATE SUPPLIES (Same Address, Consistent Names)
    -- Electricity
    INSERT INTO supplies (user_id, pod, nickname, service_type, address)
    VALUES (target_user_id, 'IT001E123456789', 'Luce Casa', 'electricity', 'Via Roma 1, Milano')
    RETURNING id INTO supply_elec_id;

    -- Gas
    INSERT INTO supplies (user_id, pod, nickname, service_type, address)
    VALUES (target_user_id, 'IT002G987654321', 'Gas Casa', 'gas', 'Via Roma 1, Milano')
    RETURNING id INTO supply_gas_id;


    -- 4. INSERT READINGS (Coherent History)

    -- ELECTRICITY (kWh) - Higher in Dec/Jan
    -- Dec 2025
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_elec_id, target_user_id, '2025-12-31', 200, 180, 191, 'auto'); -- Total 571
    -- Nov 2025
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_elec_id, target_user_id, '2025-11-30', 180, 160, 180, 'auto'); -- Total 520
    -- Oct 2025
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_elec_id, target_user_id, '2025-10-31', 170, 150, 160, 'manual'); -- Total 480
    
    -- Jan 2026 (New Year)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_elec_id, target_user_id, '2026-01-31', 210, 190, 200, 'auto'); -- Total 600

    -- GAS (Smc) - Low in Summer, High in Winter
    -- Dec 2025 (Winter - High)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_gas_id, target_user_id, '2025-12-31', 150, 0, 0, 'auto');
    -- Jan 2026 (Winter - Peak)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_gas_id, target_user_id, '2026-01-31', 180, 0, 0, 'auto');
    -- Nov 2025 (Autumn - Medium)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_gas_id, target_user_id, '2025-11-30', 90, 0, 0, 'auto');
    -- Oct 2025 (Autumn - Low)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_gas_id, target_user_id, '2025-10-31', 40, 0, 0, 'manual');
     -- Aug 2025 (Summer - Zero/Cooking only)
    INSERT INTO readings (supply_id, user_id, reading_date, f1, f2, f3, source)
    VALUES (supply_gas_id, target_user_id, '2025-08-31', 10, 0, 0, 'auto');


    -- 5. INSERT INVOICES (Matching Readings)

    -- Elec Invoice (Dec)
    INSERT INTO invoices (
        user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end
    ) VALUES (
        target_user_id, supply_elec_id, 'ELEC-2026/001', '2026-01-15', '2026-01-31', 158.40, 'unpaid', 'electricity', 571, '2025-12-01', '2025-12-31'
    );

    -- Gas Invoice (Dec)
    INSERT INTO invoices (
        user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end
    ) VALUES (
        target_user_id, supply_gas_id, 'GAS-2026/001', '2026-01-15', '2026-01-31', 110.20, 'unpaid', 'gas', 150, '2025-12-01', '2025-12-31'
    );

    -- Old Paid Invoice (Oct Elec)
    INSERT INTO invoices (
        user_id, supply_id, number, issue_date, due_date, amount, status, type, consumption_kwh, period_start, period_end
    ) VALUES (
        target_user_id, supply_elec_id, 'ELEC-2025/089', '2025-11-15', '2025-11-30', 135.00, 'paid', 'electricity', 480, '2025-10-01', '2025-10-31'
    );

END $$;
