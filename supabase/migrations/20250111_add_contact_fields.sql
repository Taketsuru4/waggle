-- Add contact fields to caregiver_profiles table
ALTER TABLE caregiver_profiles
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20),
ADD COLUMN IF NOT EXISTS viber VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN caregiver_profiles.contact_phone IS 'Contact phone number for caregiver (optional)';
COMMENT ON COLUMN caregiver_profiles.whatsapp IS 'WhatsApp number for caregiver (optional)';
COMMENT ON COLUMN caregiver_profiles.viber IS 'Viber number for caregiver (optional)';
