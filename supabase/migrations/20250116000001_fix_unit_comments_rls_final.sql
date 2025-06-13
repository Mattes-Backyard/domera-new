
-- Fix unit comments RLS policy - comprehensive approach
-- Handle both regular users and admin users across tenants

-- Drop the existing policies
DROP POLICY IF EXISTS "Users can insert unit comments with proper access" ON public.unit_comments;
DROP POLICY IF EXISTS "Users can insert unit comments for their facility units" ON public.unit_comments;
DROP POLICY IF EXISTS "Authenticated users can insert unit comments" ON public.unit_comments;

-- Create a comprehensive policy that handles all user types
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

-- Ensure there's a SELECT policy for viewing comments
DROP POLICY IF EXISTS "Users can view unit comments for their facility units" ON public.unit_comments;
CREATE POLICY "Users can view unit comments for their facility units" 
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

-- Ensure UPDATE policy exists for editing comments
DROP POLICY IF EXISTS "Users can update their own unit comments" ON public.unit_comments;
CREATE POLICY "Users can update their own unit comments" 
  ON public.unit_comments 
  FOR UPDATE 
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Ensure DELETE policy exists for deleting comments
DROP POLICY IF EXISTS "Users can delete their own unit comments" ON public.unit_comments;
CREATE POLICY "Users can delete their own unit comments" 
  ON public.unit_comments 
  FOR DELETE 
  USING (author_id = auth.uid());
