-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS messages_booking_id_idx ON messages(booking_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_booking_created_idx ON messages(booking_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view messages from their bookings" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their bookings" ON messages;
DROP POLICY IF EXISTS "Users can update read status of their received messages" ON messages;

-- Policy 1: SELECT - Users can view messages from their bookings
-- A user can view messages if they are either:
-- 1. The owner of the booking, OR
-- 2. The caregiver of the booking
CREATE POLICY "Users can view messages from their bookings"
ON messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = messages.booking_id
    AND (
      b.owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM caregiver_profiles cp
        WHERE cp.id = b.caregiver_id
        AND cp.user_id = auth.uid()
      )
    )
  )
);

-- Policy 2: INSERT - Users can send messages to their bookings
-- Same logic as SELECT: must be booking participant
CREATE POLICY "Users can send messages to their bookings"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = booking_id
    AND (
      b.owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM caregiver_profiles cp
        WHERE cp.id = b.caregiver_id
        AND cp.user_id = auth.uid()
      )
    )
  )
);

-- Policy 3: UPDATE - Users can mark messages as read (only their received messages)
-- Users can update the 'read' status ONLY if they are the recipient (not the sender)
CREATE POLICY "Users can update read status of their received messages"
ON messages
FOR UPDATE
TO authenticated
USING (
  sender_id != auth.uid()
  AND EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = messages.booking_id
    AND (
      b.owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM caregiver_profiles cp
        WHERE cp.id = b.caregiver_id
        AND cp.user_id = auth.uid()
      )
    )
  )
)
WITH CHECK (
  sender_id != auth.uid()
  AND EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = messages.booking_id
    AND (
      b.owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM caregiver_profiles cp
        WHERE cp.id = b.caregiver_id
        AND cp.user_id = auth.uid()
      )
    )
  )
);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
