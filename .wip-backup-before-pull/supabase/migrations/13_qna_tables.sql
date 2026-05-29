-- ============================================
-- Q&A COMMUNITY FEATURE
-- Questions, answers, and per-user vote toggling.
-- Shared across universities (no university filter in RLS).
-- ============================================

-- ============================================
-- QUESTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS qna_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 200),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 10 AND 10000),
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANSWERS
-- ============================================
CREATE TABLE IF NOT EXISTS qna_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES qna_questions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 5 AND 10000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOTES
-- One row per (user, target). Existence = upvote.
-- ============================================
CREATE TABLE IF NOT EXISTS qna_question_votes (
  question_id UUID NOT NULL REFERENCES qna_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (question_id, user_id)
);

CREATE TABLE IF NOT EXISTS qna_answer_votes (
  answer_id UUID NOT NULL REFERENCES qna_answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (answer_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_qna_questions_author    ON qna_questions(author_id);
CREATE INDEX IF NOT EXISTS idx_qna_questions_created   ON qna_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qna_answers_question    ON qna_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_qna_answers_author      ON qna_answers(author_id);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE qna_questions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE qna_answers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE qna_question_votes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE qna_answer_votes    ENABLE ROW LEVEL SECURITY;

-- Questions: anyone signed-in reads, only author writes/deletes its own
CREATE POLICY "Questions are viewable by everyone"
  ON qna_questions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own questions"
  ON qna_questions FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own questions"
  ON qna_questions FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own questions"
  ON qna_questions FOR DELETE
  USING (auth.uid() = author_id);

-- Answers: same pattern
CREATE POLICY "Answers are viewable by everyone"
  ON qna_answers FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own answers"
  ON qna_answers FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own answers"
  ON qna_answers FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own answers"
  ON qna_answers FOR DELETE
  USING (auth.uid() = author_id);

-- Votes: anyone reads (for counts/own-vote check), each user manages only their own
CREATE POLICY "Question votes are viewable by everyone"
  ON qna_question_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own question votes"
  ON qna_question_votes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Answer votes are viewable by everyone"
  ON qna_answer_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own answer votes"
  ON qna_answer_votes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
