-- Enable RLS logic
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to be safe and avoid conflicts
DROP POLICY IF EXISTS "Users can delete their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can update their own activity" ON public.user_activity;

-- Create comprehensive policies
CREATE POLICY "Users can delete their own activity"
  ON public.user_activity FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON public.user_activity FOR UPDATE
  USING (auth.uid() = user_id);
