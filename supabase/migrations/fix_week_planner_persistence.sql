-- 1. Safely add missing columns if they don't exist
-- We use a DO block to check for column existence and add if missing

DO $$
BEGIN
    -- Add user_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_activity' AND column_name='user_id') THEN
        ALTER TABLE public.user_activity ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add user_email if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_activity' AND column_name='user_email') THEN
        ALTER TABLE public.user_activity ADD COLUMN user_email TEXT;
    END IF;

    -- Add action_type if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_activity' AND column_name='action_type') THEN
        ALTER TABLE public.user_activity ADD COLUMN action_type TEXT;
    END IF;

    -- Add action_details if missing (crucial for week planner data)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_activity' AND column_name='action_details') THEN
        ALTER TABLE public.user_activity ADD COLUMN action_details JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_activity' AND column_name='created_at') THEN
        ALTER TABLE public.user_activity ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Ensure RLS is enabled
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- 3. Reset Policies (Drop old ones to be safe, then Create new ones)
-- We drop existing policies to avoid conflicts if they were named differently or had different logic

DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can update their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can delete their own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Enable read access for own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Enable insert access for own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Enable update access for own activity" ON public.user_activity;
DROP POLICY IF EXISTS "Enable delete access for own activity" ON public.user_activity;

-- Create fresh, correct policies
CREATE POLICY "Users can view their own activity"
ON public.user_activity FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.user_activity FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
ON public.user_activity FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity"
ON public.user_activity FOR DELETE
USING (auth.uid() = user_id);

-- 4. Grant permissions (just in case they were lost)
GRANT ALL ON public.user_activity TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.user_activity_id_seq TO authenticated;
