-- Add business contact details to vendors so /auth/vendor-onboarding can persist them.
-- The form collects city / phone / NIF; without these columns the insert in
-- src/app/[locale]/(auth)/auth/vendor-onboarding/page.tsx fails with a column-does-not-exist error.

ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS city  text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS nif   text;
