-- Make college_id optional in profiles since users can sign up without a college
ALTER TABLE public.profiles ALTER COLUMN college_id DROP NOT NULL;

-- Make college_id optional in posts since users might not be associated with a college
ALTER TABLE public.posts ALTER COLUMN college_id DROP NOT NULL;

-- Update colleges table domain to be optional for future flexibility
ALTER TABLE public.colleges ALTER COLUMN domain DROP NOT NULL;
