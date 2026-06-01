CREATE TABLE notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN (
                'application_received',
                'application_accepted',
                'application_rejected',
                'project_completed',
                'endorsement_received',
                'rating_received'
              )),
  title       TEXT        NOT NULL,
  message     TEXT,
  read        BOOLEAN     NOT NULL DEFAULT false,
  data        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread
  ON notifications (user_id, read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users only see their own notifications
CREATE POLICY notifications_select
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Only the system inserts notifications (via API routes using service role)
-- No direct client insert
CREATE POLICY notifications_update
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY notifications_delete
  ON notifications FOR DELETE
  USING (user_id = auth.uid());
