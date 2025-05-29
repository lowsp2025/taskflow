/*
  # Create Todo App Schema

  1. New Tables
    - users (profile data)
    - categories (task categories)
    - tags (task labels)
    - todos (main tasks table)
    - todo_tags (junction table for todo-tag relationships)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
    - Ensure users can only access their own data
  
  3. Performance
    - Add indexes for foreign keys
    - Add constraints for data integrity
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags"
  ON tags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON tags
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON tags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  due_date timestamptz,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create todo_tags junction table
CREATE TABLE IF NOT EXISTS todo_tags (
  todo_id uuid REFERENCES todos(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (todo_id, tag_id)
);

ALTER TABLE todo_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own todo tags"
  ON todo_tags
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = todo_id
      AND todos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own todo tags"
  ON todo_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = todo_id
      AND todos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own todo tags"
  ON todo_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = todo_id
      AND todos.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_category_id ON todos(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_tags_todo_id ON todo_tags(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_tags_tag_id ON todo_tags(tag_id);