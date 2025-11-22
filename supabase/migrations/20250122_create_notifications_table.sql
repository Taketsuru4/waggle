-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_accepted', 'booking_declined', 'booking_completed', 'booking_cancelled', 'new_message', 'new_review', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert notifications
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to automatically delete old read notifications (optional - after 30 days)
CREATE OR REPLACE FUNCTION delete_old_read_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE read = true
  AND created_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE notifications IS 'User notifications for various events in the application';
COMMENT ON COLUMN notifications.type IS 'Type of notification: booking_request, booking_accepted, booking_declined, booking_completed, booking_cancelled, new_message, new_review, system';
COMMENT ON COLUMN notifications.link IS 'Optional link to the related resource (e.g., /bookings/123)';
