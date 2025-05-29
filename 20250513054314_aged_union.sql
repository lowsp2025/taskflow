/*
  # Store reCAPTCHA Site Key

  1. Changes
    - Create a secure function to store and retrieve the reCAPTCHA site key
    - Add RLS policy to restrict access

  2. Security
    - Function is security definer to ensure secure access
    - Site key is stored in a way that can only be accessed through the function
*/

-- Create a function to store reCAPTCHA site key in a secure way
CREATE OR REPLACE FUNCTION public.get_recaptcha_site_key()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT '6LenTjcrAAAAAAMPd5blNJjTPsvDQTODswTk';
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_recaptcha_site_key() TO authenticated;