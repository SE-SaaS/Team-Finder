-- ============================================
-- PRIVATE CHATS BETWEEN STUDENTS
-- 1-on-1 threads, immutable history (no delete),
-- senders can edit their own messages,
-- each participant can mute (= archive) the thread.
-- ============================================

-- ============================================
-- THREADS
-- One row per ordered pair (user_a < user_b) guarantees a
-- single canonical thread per pair regardless of who opened it.
-- ============================================
CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_a_id < user_b_id),
  UNIQUE (user_a_id, user_b_id)
);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  edited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PER-PARTICIPANT STATE
-- muted = archived (still receives messages; lives in Archive tab)
-- last_read_at drives unread counts
-- ============================================
CREATE TABLE IF NOT EXISTS chat_participant_state (
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  muted BOOLEAN NOT NULL DEFAULT false,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_chat_threads_user_a       ON chat_threads(user_a_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_user_b       ON chat_threads(user_b_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_last_msg     ON chat_threads(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread      ON chat_messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender      ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_participant_user     ON chat_participant_state(user_id);

-- ============================================
-- TRIGGER: bump thread.last_message_at on new message
-- ============================================
CREATE OR REPLACE FUNCTION chat_bump_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_threads
     SET last_message_at = NEW.created_at
   WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION chat_restrict_message_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.thread_id <> OLD.thread_id THEN
    RAISE EXCEPTION 'thread_id is immutable';
  END IF;

  IF NEW.sender_id <> OLD.sender_id THEN
    RAISE EXCEPTION 'sender_id is immutable';
  END IF;

  IF NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'created_at is immutable';
  END IF;

  NEW.edited := true;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chat_bump_thread_last_message ON chat_messages;
CREATE TRIGGER trg_chat_bump_thread_last_message
AFTER INSERT ON chat_messages
FOR EACH ROW EXECUTE FUNCTION chat_bump_thread_last_message();

DROP TRIGGER IF EXISTS trg_chat_restrict_message_updates ON chat_messages;
CREATE TRIGGER trg_chat_restrict_message_updates
BEFORE UPDATE ON chat_messages
FOR EACH ROW EXECUTE FUNCTION chat_restrict_message_updates();

-- ============================================
-- RLS
-- ============================================
ALTER TABLE chat_threads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participant_state  ENABLE ROW LEVEL SECURITY;

-- Threads: visible only to the two participants; either may insert (and must include themselves).
-- No UPDATE or DELETE policies => modifying or deleting a thread is impossible.
CREATE POLICY "Participants can view their threads"
  ON chat_threads FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Authenticated users can create a thread including themselves"
  ON chat_threads FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Messages: participants read; sender writes (their own); sender edits own row.
-- No DELETE policy => messages cannot be deleted.
CREATE POLICY "Participants can read messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_messages.thread_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Sender (who is a participant) can insert messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_messages.thread_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Sender can edit own message"
  ON chat_messages FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Participant state: each user reads & manages only their own row.
CREATE POLICY "Users read own participant state"
  ON chat_participant_state FOR SELECT
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_participant_state.thread_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users manage own participant state"
  ON chat_participant_state FOR ALL
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_participant_state.thread_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_participant_state.thread_id
        AND (t.user_a_id = auth.uid() OR t.user_b_id = auth.uid())
    )
  );
