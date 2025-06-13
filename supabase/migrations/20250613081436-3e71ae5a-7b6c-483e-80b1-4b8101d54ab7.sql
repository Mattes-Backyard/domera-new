
-- Drop all existing unit_comments policies to start fresh
DROP POLICY IF EXISTS "Users can insert unit comments with proper access" ON public.unit_comments;
DROP POLICY IF EXISTS "Users can insert unit comments for their facility units" ON public.unit_comments;
DROP POLICY IF EXISTS "Authenticated users can insert unit comments" ON public.unit_comments;
DROP POLICY IF EXISTS "Users can view unit comments for their facility units" ON public.unit_comments;
DROP POLICY IF EXISTS "Users can update their own unit comments" ON public.unit_comments;
DROP POLICY IF EXISTS "Users can delete their own unit comments" ON public.unit_comments;

-- Create a simplified INSERT policy that works for both regular users and admins
CREATE POLICY "Allow authenticated users to insert unit comments" 
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
      AND (
        -- Regular users: unit must be in their facility
        EXISTS (
          SELECT 1 
          FROM public.units u 
          WHERE u.id = unit_comments.unit_id 
          AND u.facility_id = p.facility_id
        )
        OR
        -- Admin users: unit can be in any facility within their tenant
        (
          p.role = 'admin' 
          AND EXISTS (
            SELECT 1 
            FROM public.units u 
            JOIN public.facilities f_unit ON f_unit.id = u.facility_id
            JOIN public.facilities f_user ON f_user.id = p.facility_id
            WHERE u.id = unit_comments.unit_id 
            AND f_unit.tenant_id = f_user.tenant_id
          )
        )
      )
    )
  );

-- Create SELECT policy
CREATE POLICY "Allow users to view unit comments" 
  ON public.unit_comments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles p 
      WHERE p.id = auth.uid()
      AND p.facility_id IS NOT NULL
      AND (
        -- Regular users: unit must be in their facility
        EXISTS (
          SELECT 1 
          FROM public.units u 
          WHERE u.id = unit_comments.unit_id 
          AND u.facility_id = p.facility_id
        )
        OR
        -- Admin users: unit can be in any facility within their tenant
        (
          p.role = 'admin' 
          AND EXISTS (
            SELECT 1 
            FROM public.units u 
            JOIN public.facilities f_unit ON f_unit.id = u.facility_id
            JOIN public.facilities f_user ON f_user.id = p.facility_id
            WHERE u.id = unit_comments.unit_id 
            AND f_unit.tenant_id = f_user.tenant_id
          )
        )
      )
    )
  );

-- Create UPDATE policy (users can only update their own comments)
CREATE POLICY "Allow users to update their own comments" 
  ON public.unit_comments 
  FOR UPDATE 
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Create DELETE policy (users can only delete their own comments)
CREATE POLICY "Allow users to delete their own comments" 
  ON public.unit_comments 
  FOR DELETE 
  USING (author_id = auth.uid());
