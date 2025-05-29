/*
  # Add remaining policies and indexes

  1. Changes
    - Add missing policies for comments table
    - Add missing policies for exercise_counts table
    - Add performance indexes
  
  2. Security
    - Comments policies allow public read but authenticated CRUD
    - Exercise counts policies restrict all operations to authenticated users
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop comments policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    DROP POLICY "Enable read access for all users" ON comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Enable delete access for comment owners'
  ) THEN
    DROP POLICY "Enable delete access for comment owners" ON comments;
  END IF;

  -- Drop exercise_counts policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'exercise_counts' 
    AND policyname = 'Users can view their own exercise counts'
  ) THEN
    DROP POLICY "Users can view their own exercise counts" ON exercise_counts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'exercise_counts' 
    AND policyname = 'Users can insert their own exercise counts'
  ) THEN
    DROP POLICY "Users can insert their own exercise counts" ON exercise_counts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'exercise_counts' 
    AND policyname = 'Users can update their own exercise counts'
  ) THEN
    DROP POLICY "Users can update their own exercise counts" ON exercise_counts;
  END IF;
END $$;

-- Add policies for comments table
CREATE POLICY "Enable read access for all users"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable delete access for comment owners"
  ON comments
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Add policies for exercise_counts table
CREATE POLICY "Users can view their own exercise counts"
  ON exercise_counts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise counts"
  ON exercise_counts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise counts"
  ON exercise_counts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_exercise_counts_user_id ON exercise_counts(user_id);