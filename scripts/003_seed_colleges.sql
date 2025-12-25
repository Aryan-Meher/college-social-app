-- Seed some popular colleges
INSERT INTO public.colleges (name, domain) VALUES
  ('Veer Surendra Sai University of Technology, Burla', 'vssut.ac.in')
ON CONFLICT (domain) DO NOTHING;
