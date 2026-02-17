-- FIX SCRIPT: Run this in Supabase SQL Editor to FIX "RLS Policy" errors

-- 1. Enable RLS (just to be sure)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow INSERT (This is likely what was missing for new users)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Allow UPDATE
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Allow SELECT
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);
