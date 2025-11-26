-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow anyone to view feedback
CREATE POLICY "Anyone can view feedback" 
ON public.feedback 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create index on created_at for efficient sorting
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);