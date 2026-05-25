-- Supabase Migration: 20260522_public_leads_policies.sql
-- Enables anonymous visitor lead submission and form selection, while keeping admin dashboard rights.

-- 1. Policies for 'forms' table
DROP POLICY IF EXISTS "Public read access for forms" ON forms;
CREATE POLICY "Public read access for forms" ON forms 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage forms" ON forms;
CREATE POLICY "Authenticated users can manage forms" ON forms 
FOR ALL USING (auth.role() = 'authenticated');

-- 2. Policies for 'leads' table
DROP POLICY IF EXISTS "Public insert access for leads" ON leads;
CREATE POLICY "Public insert access for leads" ON leads 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;
CREATE POLICY "Authenticated users can manage leads" ON leads 
FOR ALL USING (auth.role() = 'authenticated');
