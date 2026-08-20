CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  interest TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 120
  AND length(phone) BETWEEN 5 AND 30
  AND length(email) BETWEEN 3 AND 200
  AND (interest IS NULL OR length(interest) <= 200)
  AND (message IS NULL OR length(message) <= 2000)
);