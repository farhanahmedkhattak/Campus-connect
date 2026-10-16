-- ==============================================================================
-- CampusConnect — Air University Kamra Complete Database Schema & RLS Policies
-- Target: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('student', 'moderator', 'faculty', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE exam_term AS ENUM ('midterm', 'final');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'like', 
        'comment', 
        'follow', 
        'announcement', 
        'post_approved', 
        'post_rejected', 
        'poll_ended'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. AUTOMATIC TIMESTAMP TRIGGER HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLES DEFINITIONS
-- ==============================================================================

-- A. PROFILES (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu(\.pk)?$'),
    full_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    role app_role NOT NULL DEFAULT 'student',
    department TEXT NOT NULL DEFAULT 'Computer Science',
    student_id TEXT,          -- AU Registration Number (e.g. '220198-BSCY')
    batch_year INT DEFAULT 2024,
    bio TEXT CHECK (char_length(bio) <= 280),
    followers_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    is_banned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT username_alphanumeric CHECK (username ~* '^[a-zA-Z0-9_]{3,24}$')
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- B. COMMUNITY POSTS (Moderated Student Submissions)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
    department TEXT NOT NULL,
    image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    status content_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ,
    likes_count INT NOT NULL DEFAULT 0,
    comments_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_posts_feed_approved 
ON public.posts (status, created_at DESC) WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_department ON public.posts (department);

CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- C. POST LIKES (Prevents duplicate likes per user per post)
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_post_user_like UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes (user_id);

-- D. COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments (post_id, created_at ASC);

CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- E. CAMPUS POLLS & PRIVACY-PRESERVING VOTING
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID UNIQUE REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL CHECK (char_length(question) BETWEEN 5 AND 300),
    is_anonymous BOOLEAN NOT NULL DEFAULT true,
    closes_at TIMESTAMPTZ NOT NULL,
    total_votes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL CHECK (char_length(option_text) BETWEEN 1 AND 150),
    vote_count INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0
);

-- Tracks eligibility & enforces 1-person-1-vote
CREATE TABLE IF NOT EXISTS public.poll_voters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    voted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_voter_per_poll UNIQUE (poll_id, user_id)
);

-- Actual ballots: user_id is strictly NULL for anonymous polls to ensure mathematical zero-knowledge privacy
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- F. PRIVATE BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_post_bookmark UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks (user_id);

-- G. SOCIAL FOLLOWS
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT prevent_self_follow CHECK (follower_id <> following_id),
    CONSTRAINT unique_follow_pair UNIQUE (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows (following_id);

-- H. OFFICIAL ANNOUNCEMENTS (Authorable exclusively by Faculty & Admin)
CREATE TABLE IF NOT EXISTS public.official_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Academic & Exams',
    priority priority_level NOT NULL DEFAULT 'medium',
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_announcements_pinned 
ON public.official_announcements (is_pinned DESC, created_at DESC);

CREATE TRIGGER trg_announcements_updated_at
BEFORE UPDATE ON public.official_announcements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- I. SOCIETIES & CLUBS
CREATE TABLE IF NOT EXISTS public.societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo TEXT NOT NULL DEFAULT 'BookOpen',
    category TEXT NOT NULL DEFAULT 'Technical',
    department TEXT NOT NULL DEFAULT 'Campus Wide',
    lead_name TEXT NOT NULL,
    members_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- J. CAMPUS EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(title) <= 150),
    description TEXT NOT NULL,
    venue TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    banner_url TEXT,
    registered_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- K. ACADEMIC PAST PAPERS
CREATE TABLE IF NOT EXISTS public.past_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL, -- e.g. 'CY-301'
    course_name TEXT NOT NULL, -- e.g. 'Network Security & Cryptography'
    department TEXT NOT NULL,  -- e.g. 'Cyber Security'
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    exam_type exam_term NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 2015 AND 2030),
    file_url TEXT NOT NULL,
    file_size TEXT NOT NULL DEFAULT '1.5 MB',
    downloads INT NOT NULL DEFAULT 0,
    status content_status NOT NULL DEFAULT 'approved',
    moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_past_papers_filter 
ON public.past_papers (department, semester, exam_type);

-- L. STUDENT FEEDBACK (Confidential Tickets)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    category TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (char_length(subject) <= 150),
    message TEXT NOT NULL CHECK (char_length(message) <= 2000),
    status TEXT NOT NULL DEFAULT 'open',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- M. MODERATION AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL, -- 'post', 'comment', 'past_paper'
    target_id UUID NOT NULL,
    action TEXT NOT NULL,      -- 'approved', 'rejected', 'deleted'
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- N. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    target_type TEXT,
    target_id UUID,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient 
ON public.notifications (recipient_id, is_read, created_at DESC);

-- ==============================================================================
-- 5. BUSINESS LOGIC FUNCTIONS & SECURE STORED PROCEDURES
-- ==============================================================================

-- 5.1 Auto-Create Profile on Signup with AU .edu domain verification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_email TEXT := NEW.email;
    v_username TEXT;
    v_full_name TEXT;
BEGIN
    -- Strict .edu or .edu.pk validation
    IF v_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu(\.pk)?$' THEN
        RAISE EXCEPTION 'Registration rejected: Email must belong to an authorized .edu or .edu.pk university domain.';
    END IF;

    -- Extract username from email prefix or metadata
    v_username := lower(split_part(v_email, '@', 1));
    v_username := regexp_replace(v_username, '[^a-zA-Z0-9_]', '_', 'g');

    -- Ensure unique username
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) THEN
        v_username := v_username || '_' || substr(NEW.id::text, 1, 4);
    END IF;

    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        initcap(split_part(v_email, '@', 1))
    );

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        username,
        avatar_url,
        role,
        department,
        batch_year
    ) VALUES (
        NEW.id,
        v_email,
        v_full_name,
        v_username,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        'student',
        'Computer Science',
        2024
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5.2 Protect Sensitive Profile Fields (Prevents Self-Escalation to Moderator/Admin)
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.role IS DISTINCT FROM OLD.role) OR (NEW.is_banned IS DISTINCT FROM OLD.is_banned) THEN
        IF (auth.jwt() ->> 'role' <> 'service_role') AND 
           NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
            RAISE EXCEPTION 'Unauthorized: Role and moderation status modifications require administrator privileges.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- 5.3 Atomic Zero-Knowledge Poll Voting Procedure
CREATE OR REPLACE FUNCTION public.submit_poll_vote(p_poll_id UUID, p_option_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_is_anonymous BOOLEAN;
    v_closes_at TIMESTAMPTZ;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to vote.';
    END IF;

    SELECT is_anonymous, closes_at INTO v_is_anonymous, v_closes_at
    FROM public.polls WHERE id = p_poll_id;

    IF v_closes_at IS NULL THEN
        RAISE EXCEPTION 'Poll not found.';
    END IF;

    IF v_closes_at < now() THEN
        RAISE EXCEPTION 'This poll has already closed.';
    END IF;

    -- Check if user already voted in this poll
    IF EXISTS (SELECT 1 FROM public.poll_voters WHERE poll_id = p_poll_id AND user_id = v_user_id) THEN
        RAISE EXCEPTION 'You have already voted in this poll.';
    END IF;

    -- 1. Record voter participation (1 person 1 vote)
    INSERT INTO public.poll_voters (poll_id, user_id)
    VALUES (p_poll_id, v_user_id);

    -- 2. Record ballot (user_id is strictly NULL for anonymous polls)
    INSERT INTO public.poll_votes (poll_id, option_id, user_id)
    VALUES (p_poll_id, p_option_id, CASE WHEN v_is_anonymous THEN NULL ELSE v_user_id END);

    -- 3. Atomic counter updates
    UPDATE public.poll_options SET vote_count = vote_count + 1 WHERE id = p_option_id;
    UPDATE public.polls SET total_votes = total_votes + 1 WHERE id = p_poll_id;

    RETURN jsonb_build_object('success', true, 'is_anonymous', v_is_anonymous);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.4 Moderation Approval Stored Procedure
CREATE OR REPLACE FUNCTION public.approve_post(p_post_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_mod_id UUID := auth.uid();
    v_mod_role app_role;
    v_author_id UUID;
BEGIN
    IF v_mod_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    SELECT role INTO v_mod_role FROM public.profiles WHERE id = v_mod_id;
    IF v_mod_role NOT IN ('moderator', 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Only moderators and administrators can approve posts.';
    END IF;

    SELECT author_id INTO v_author_id FROM public.posts WHERE id = p_post_id;
    IF v_author_id IS NULL THEN
        RAISE EXCEPTION 'Post not found.';
    END IF;

    -- Update post status
    UPDATE public.posts
    SET status = 'approved',
        moderated_by = v_mod_id,
        moderated_at = timezone('utc'::text, now()),
        rejection_reason = NULL
    WHERE id = p_post_id;

    -- Record moderation audit log
    INSERT INTO public.moderation_logs (moderator_id, target_type, target_id, action, reason)
    VALUES (v_mod_id, 'post', p_post_id, 'approved', 'Meets Air University Kamra community standards');

    -- Notify post author
    INSERT INTO public.notifications (recipient_id, actor_id, type, target_type, target_id, message)
    VALUES (
        v_author_id,
        v_mod_id,
        'post_approved',
        'post',
        p_post_id,
        'Your campus post has been reviewed and approved for the public feed.'
    );

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.5 Moderation Rejection Stored Procedure
CREATE OR REPLACE FUNCTION public.reject_post(p_post_id UUID, p_reason TEXT)
RETURNS JSONB AS $$
DECLARE
    v_mod_id UUID := auth.uid();
    v_mod_role app_role;
    v_author_id UUID;
BEGIN
    IF v_mod_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    SELECT role INTO v_mod_role FROM public.profiles WHERE id = v_mod_id;
    IF v_mod_role NOT IN ('moderator', 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Only moderators and administrators can reject posts.';
    END IF;

    SELECT author_id INTO v_author_id FROM public.posts WHERE id = p_post_id;
    IF v_author_id IS NULL THEN
        RAISE EXCEPTION 'Post not found.';
    END IF;

    UPDATE public.posts
    SET status = 'rejected',
        moderated_by = v_mod_id,
        moderated_at = timezone('utc'::text, now()),
        rejection_reason = p_reason
    WHERE id = p_post_id;

    INSERT INTO public.moderation_logs (moderator_id, target_type, target_id, action, reason)
    VALUES (v_mod_id, 'post', p_post_id, 'rejected', p_reason);

    INSERT INTO public.notifications (recipient_id, actor_id, type, target_type, target_id, message)
    VALUES (
        v_author_id,
        v_mod_id,
        'post_rejected',
        'post',
        p_post_id,
        'Your post was rejected by moderators. Reason: ' || p_reason
    );

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6.1 PROFILES POLICIES
CREATE POLICY "Public profiles are readable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile details" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 6.2 POSTS POLICIES
CREATE POLICY "View approved or self-submitted posts" 
ON public.posts FOR SELECT TO authenticated USING (
    status = 'approved'
    OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);

CREATE POLICY "Authenticated non-banned users can create pending posts" 
ON public.posts FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id
    AND status = 'pending'
    AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_banned = true)
);

CREATE POLICY "Authors can delete their own posts" 
ON public.posts FOR DELETE TO authenticated USING (
    auth.uid() = author_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);

-- 6.3 POST LIKES POLICIES
CREATE POLICY "Anyone can view likes" 
ON public.post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can toggle their own like" 
ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own like" 
ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6.4 COMMENTS POLICIES
CREATE POLICY "View comments on readable posts" 
ON public.comments FOR SELECT TO authenticated USING (
    NOT is_deleted
    AND EXISTS (
        SELECT 1 FROM public.posts 
        WHERE id = post_id AND (status = 'approved' OR author_id = auth.uid())
    )
);

CREATE POLICY "Authenticated users can comment on approved posts" 
ON public.comments FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND status = 'approved')
);

CREATE POLICY "Authors and moderators can remove comments" 
ON public.comments FOR DELETE TO authenticated USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);

-- 6.5 POLLS POLICIES
CREATE POLICY "View polls" 
ON public.polls FOR SELECT TO authenticated USING (true);

CREATE POLICY "View poll options" 
ON public.poll_options FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can check their own voter status" 
ON public.poll_voters FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Direct inserts to poll_votes blocked (Must use submit_poll_vote RPC)" 
ON public.poll_votes FOR ALL TO authenticated USING (false);

-- 6.6 BOOKMARKS POLICIES (Exclusively private to owner)
CREATE POLICY "Users exclusively manage own bookmarks" 
ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 6.7 FOLLOWS POLICIES
CREATE POLICY "View follow relationships" 
ON public.follows FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users manage own follows" 
ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users remove own follows" 
ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- 6.8 OFFICIAL ANNOUNCEMENTS POLICIES (Faculty & Admin Only)
CREATE POLICY "Anyone can view official announcements" 
ON public.official_announcements FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only faculty and admin can publish official announcements" 
ON public.official_announcements FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
);

CREATE POLICY "Only faculty and admin can update announcements" 
ON public.official_announcements FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('faculty', 'admin')
    )
);

-- 6.9 SOCIETIES & EVENTS POLICIES
CREATE POLICY "View societies" 
ON public.societies FOR SELECT TO authenticated USING (true);

CREATE POLICY "View campus events" 
ON public.events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Publish campus events" 
ON public.events FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = organizer_id
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('moderator', 'faculty', 'admin')
    )
);

-- 6.10 PAST PAPERS POLICIES
CREATE POLICY "View approved past papers" 
ON public.past_papers FOR SELECT TO authenticated USING (
    status = 'approved' 
    OR uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
);

CREATE POLICY "Upload past paper for review" 
ON public.past_papers FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

-- 6.11 FEEDBACK POLICIES (Private to student author and admins)
CREATE POLICY "Students see own feedback; admins see all" 
ON public.feedback FOR SELECT TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone authenticated can submit feedback" 
ON public.feedback FOR INSERT TO authenticated WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
);

-- 6.12 MODERATION LOGS POLICIES
CREATE POLICY "Moderators view own logs; admins view all" 
ON public.moderation_logs FOR SELECT TO authenticated USING (
    moderator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6.13 NOTIFICATIONS POLICIES
CREATE POLICY "Users read own notifications" 
ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Users update own notifications" 
ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);

-- ==============================================================================
-- 7. INITIAL AU KAMRA SEED DATA
-- ==============================================================================
INSERT INTO public.societies (name, slug, category, department, lead_name, members_count, logo, description)
VALUES 
('Cyber Security Society (CSS)', 'cyber-security-society', 'Technical', 'Cyber Security', 'Dr. Tariq Mahmood (Advisor)', 230, 'Shield', 'Air University Kamra premier technical chapter for ethical hacking, digital forensics, and defense tournaments.'),
('AeroDesign & Flight Society', 'aerodesign-society', 'Engineering', 'Aeronautical Engineering', 'Prof. Asim Munir (Advisor)', 185, 'Plane', 'Experimental UAV design, aerodynamics research, and flight telemetry testing at Kamra grounds.'),
('AI & Data Science Guild', 'ai-guild', 'Technical', 'Artificial Intelligence', 'Engr. Fatima Zahra (Lead)', 195, 'Brain', 'Machine learning research, Kaggle hackathons, computer vision, and neural network engineering.'),
('AU Kamra Literary & Debating Club', 'literary-club', 'Cultural', 'Campus Wide', 'Ali Raza (President)', 140, 'BookOpen', 'Bilingual declamations, parliamentary debates, and creative student writing.')
ON CONFLICT (slug) DO NOTHING;
