-- Create activities table
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own activities" ON activities
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activities" ON activities
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX activities_user_id_idx ON activities(user_id);
CREATE INDEX activities_timestamp_idx ON activities(timestamp); 