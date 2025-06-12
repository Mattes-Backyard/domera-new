
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admin and manager can insert unit comments" ON public.unit_comments;

-- Create a more permissive policy that allows any authenticated user with access to the facility
CREATE POLICY "Users can insert unit comments for their facility units" 
  ON public.unit_comments 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_comments.unit_id 
      AND p.id = auth.uid()
    )
  );

-- Also ensure users can delete their own comments
DROP POLICY IF EXISTS "Users can delete their own unit comments" ON public.unit_comments;
CREATE POLICY "Users can delete their own unit comments" 
  ON public.unit_comments 
  FOR DELETE 
  USING (author_id = auth.uid());
