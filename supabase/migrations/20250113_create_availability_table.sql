-- Enable btree_gist extension for exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create availability table for caregivers
CREATE TABLE caregiver_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES caregiver_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure end_time is after start_time
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Add indexes
CREATE INDEX idx_availability_caregiver ON caregiver_availability(caregiver_id);
CREATE INDEX idx_availability_date ON caregiver_availability(date);
CREATE INDEX idx_availability_caregiver_date ON caregiver_availability(caregiver_id, date);

-- Add exclusion constraint to prevent overlapping time slots
-- This ensures a caregiver cannot have overlapping availability on the same date
ALTER TABLE caregiver_availability 
ADD CONSTRAINT no_overlap EXCLUDE USING GIST (
  caregiver_id WITH =,
  date WITH =,
  tstzrange(
    (date + start_time)::timestamptz,
    (date + end_time)::timestamptz
  ) WITH &&
);

-- Add trigger for updated_at
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON caregiver_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE caregiver_availability ENABLE ROW LEVEL SECURITY;

-- Anyone can view available slots
CREATE POLICY "Anyone can view availability"
  ON caregiver_availability
  FOR SELECT
  USING (is_available = true);

-- Caregivers can manage their own availability
CREATE POLICY "Caregivers can manage their availability"
  ON caregiver_availability
  FOR ALL
  USING (
    caregiver_id IN (
      SELECT id FROM caregiver_profiles WHERE user_id = auth.uid()
    )
  );

-- Create a view for easy availability checking
CREATE OR REPLACE VIEW caregiver_available_slots AS
SELECT 
  ca.id,
  ca.caregiver_id,
  ca.date,
  ca.start_time,
  ca.end_time,
  ca.is_available,
  cp.city,
  cp.hourly_rate,
  p.full_name,
  p.avatar_url
FROM caregiver_availability ca
JOIN caregiver_profiles cp ON ca.caregiver_id = cp.id
JOIN profiles p ON cp.user_id = p.id
WHERE ca.is_available = true
  AND ca.date >= CURRENT_DATE
ORDER BY ca.date, ca.start_time;
