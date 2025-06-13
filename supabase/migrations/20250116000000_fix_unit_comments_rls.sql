-- Fix unit comments RLS policy - simplified approach
-- The issue appears to be with the complex JOIN condition failing

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert unit comments for their facility units" ON public.unit_comments;

-- Create a more permissive policy that focuses on the core security requirement
-- Allow authenticated users to insert comments if they own the comment (author_id matches)
-- and they have access to the unit's facility
CREATE POLICY "Authenticated users can insert unit comments" 
  ON public.unit_comments 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND author_id = auth.uid()
    AND EXISTS (
      SELECT 1 
      FROM public.profiles p 
      WHERE p.id = auth.uid()
      AND p.facility_id IS NOT NULL
      AND EXISTS (
        SELECT 1 
        FROM public.units u 
        WHERE u.id = unit_comments.unit_id 
        AND u.facility_id = p.facility_id
      )
    )
  );