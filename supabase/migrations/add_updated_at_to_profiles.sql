-- FIX SCRIPT: Run this in Supabase SQL Editor to ADD the missing column

DO $$
BEGIN
    -- Check if the column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Column updated_at added to profiles table.';
    ELSE
        RAISE NOTICE 'Column updated_at already exists.';
    END IF;
END $$;
