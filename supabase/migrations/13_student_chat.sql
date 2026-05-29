-- ── Student-to-student chat ────────────────────────────────────────────────

-- Conversations (one row per DM thread)
CREATE TABLE conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL    DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL    DEFAULT now()
);

-- Who is in the conversation (always 2 participants for DMs)
CREATE TABLE conversation_participants (
  conversation_id UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES profiles(id)      ON DELETE CASCADE,
  is_archived     BOOLEAN     NOT NULL DEFAULT false,
  last_read_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages within a conversation
CREATE TABLE messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID        NOT NULL REFERENCES profiles(id)      ON DELETE CASCADE,
  content         TEXT        NOT NULL CHECK (char_length(trim(content)) > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at       TIMESTAMPTZ,
  is_edited       BOOLEAN     NOT NULL DEFAULT false,
  is_deleted      BOOLEAN     NOT NULL DEFAULT false
);

-- Ignore list: ignoring someone archives their conversation (does NOT block)
CREATE TABLE ignored_users (
  ignorer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ignored_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ignorer_id, ignored_id),
  CHECK (ignorer_id <> ignored_id)
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_cp_user         ON conversation_participants(user_id);
CREATE INDEX idx_cp_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_msg_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_ignored_ignorer  ON ignored_users(ignorer_id);

-- ── Auto-bump conversations.updated_at on new message ─────────────────────
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER messages_bump_conversation
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- ── Row-Level Security ────────────────────────────────────────────────────
ALTER TABLE conversations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignored_users             ENABLE ROW LEVEL SECURITY;

-- conversations: visible only to participants
CREATE POLICY conv_select ON conversations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id AND user_id = auth.uid()
  )
);
CREATE POLICY conv_insert ON conversations FOR INSERT WITH CHECK (true);

-- conversation_participants: see all rows for conversations you're in
CREATE POLICY cp_select ON conversation_participants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp2
    WHERE cp2.conversation_id = conversation_participants.conversation_id
      AND cp2.user_id = auth.uid()
  )
);
CREATE POLICY cp_insert ON conversation_participants FOR INSERT WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM conversation_participants cp2
    WHERE cp2.conversation_id = conversation_participants.conversation_id
      AND cp2.user_id = auth.uid()
  )
);
CREATE POLICY cp_update ON conversation_participants FOR UPDATE USING (user_id = auth.uid());

-- messages: readable/writable only inside your conversations
CREATE POLICY msg_select ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  )
);
CREATE POLICY msg_insert ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  )
);
-- only sender can edit/soft-delete own messages
CREATE POLICY msg_update ON messages FOR UPDATE USING (sender_id = auth.uid());

-- ignored_users: own rows only
CREATE POLICY ignore_select ON ignored_users FOR SELECT USING (ignorer_id = auth.uid());
CREATE POLICY ignore_insert ON ignored_users FOR INSERT WITH CHECK (ignorer_id = auth.uid());
CREATE POLICY ignore_delete ON ignored_users FOR DELETE USING (ignorer_id = auth.uid());
