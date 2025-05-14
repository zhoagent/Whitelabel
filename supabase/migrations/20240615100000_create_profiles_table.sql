-- supabase/migrations/20240615100000_create_profiles_table.sql

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    full_name TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
    -- Add other profile fields as needed, e.g., bio, website, etc.
);

COMMENT ON TABLE public.profiles IS 'Stores public profile data for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References the internal Supabase Auth user.id.';
COMMENT ON COLUMN public.profiles.username IS 'Publicly visible unique username. Can be null initially if derived later.';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to the user''s avatar image.';
COMMENT ON COLUMN public.profiles.full_name IS 'User''s full name for display purposes.';
COMMENT ON COLUMN public.profiles.updated_at IS 'Timestamp of the last profile update.';

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public.profiles table

-- 1. Users can view their own profile.
CREATE POLICY "Users can view their own profile."
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- 2. Users can insert their own profile.
-- This is typically handled by the handle_new_user trigger.
-- If manual insertion by user is needed post-signup (e.g. if trigger failed or for a different flow):
CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile.
CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Optional: Allow authenticated users to read specific public fields of ANY profile (e.g., username, avatar_url)
-- Be very careful with this. Ensure you only select the intended columns in your application queries.
-- For a stricter template, this is commented out by default.
-- CREATE POLICY "Authenticated users can read basic public profile info."
--     ON public.profiles FOR SELECT TO authenticated -- Or 'public' if truly public
--     USING (true); -- This makes all rows visible; column-level grants are NOT part of RLS, so client must select specific columns.


-- Function to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name) -- Or only id, and let user fill others
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username', -- Attempt to get username from metadata (e.g., from OAuth provider)
    new.raw_user_meta_data->>'full_name' -- Attempt to get full_name from metadata
  );
  -- If username from metadata is null or not unique, you might want a fallback:
  -- e.g., COALESCE(new.raw_user_meta_data->>'user_name', new.email)
  -- Ensure the username chosen here respects the UNIQUE constraint on the profiles.username column.
  -- If email is used as username, ensure it's unique.
  -- A more robust solution for username might involve generating a unique one if not provided or if it clashes.
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile row for new users using data from auth.users.';

-- Trigger to call the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- To keep `updated_at` fresh automatically on updates to the profile
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
