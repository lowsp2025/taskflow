/*
  # Add Performance Indexes
  
  1. Changes
    - Add indexes for comments table (user_id, post_id)
    - Add index for exercise_counts table (user_id)
  
  2. Performance
    - Improves query performance for filtering by user_id
    - Improves join performance with posts table
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_exercise_counts_user_id ON exercise_counts(user_id);