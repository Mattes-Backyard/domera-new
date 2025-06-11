
-- Create table for unit status history
CREATE TABLE public.unit_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  status unit_status NOT NULL,
  previous_status unit_status,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for unit price history
CREATE TABLE public.unit_price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  monthly_rate NUMERIC NOT NULL,
  previous_rate NUMERIC,
  changed_by UUID REFERENCES auth.users(id),
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for unit comments/remarks
CREATE TABLE public.unit_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_unit_status_history_unit_id ON public.unit_status_history(unit_id);
CREATE INDEX idx_unit_status_history_created_at ON public.unit_status_history(created_at DESC);
CREATE INDEX idx_unit_price_history_unit_id ON public.unit_price_history(unit_id);
CREATE INDEX idx_unit_price_history_effective_date ON public.unit_price_history(effective_date DESC);
CREATE INDEX idx_unit_comments_unit_id ON public.unit_comments(unit_id);
CREATE INDEX idx_unit_comments_created_at ON public.unit_comments(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.unit_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for unit_status_history
CREATE POLICY "Users can view unit status history for their facility units" 
  ON public.unit_status_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_status_history.unit_id 
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Admin and manager can insert unit status history" 
  ON public.unit_status_history 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_status_history.unit_id 
      AND p.id = auth.uid()
      AND p.role IN ('admin', 'manager')
    )
  );

-- Create RLS policies for unit_price_history
CREATE POLICY "Users can view unit price history for their facility units" 
  ON public.unit_price_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_price_history.unit_id 
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Admin and manager can insert unit price history" 
  ON public.unit_price_history 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_price_history.unit_id 
      AND p.id = auth.uid()
      AND p.role IN ('admin', 'manager')
    )
  );

-- Create RLS policies for unit_comments
CREATE POLICY "Users can view unit comments for their facility units" 
  ON public.unit_comments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_comments.unit_id 
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Admin and manager can insert unit comments" 
  ON public.unit_comments 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.units u 
      JOIN public.profiles p ON p.facility_id = u.facility_id 
      WHERE u.id = unit_comments.unit_id 
      AND p.id = auth.uid()
      AND p.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can update their own unit comments" 
  ON public.unit_comments 
  FOR UPDATE 
  USING (author_id = auth.uid());

-- Function to automatically log unit status changes
CREATE OR REPLACE FUNCTION log_unit_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.unit_status_history (
      unit_id,
      status,
      previous_status,
      changed_by,
      reason
    ) VALUES (
      NEW.id,
      NEW.status,
      OLD.status,
      auth.uid(),
      'Status updated'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically log unit price changes
CREATE OR REPLACE FUNCTION log_unit_price_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if monthly_rate actually changed
  IF OLD.monthly_rate IS DISTINCT FROM NEW.monthly_rate THEN
    INSERT INTO public.unit_price_history (
      unit_id,
      monthly_rate,
      previous_rate,
      changed_by,
      reason
    ) VALUES (
      NEW.id,
      NEW.monthly_rate,
      OLD.monthly_rate,
      auth.uid(),
      'Price updated'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically log changes
CREATE TRIGGER unit_status_change_trigger
  AFTER UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION log_unit_status_change();

CREATE TRIGGER unit_price_change_trigger
  AFTER UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION log_unit_price_change();
