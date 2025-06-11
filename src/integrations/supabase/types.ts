export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      company_info: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          currency: string
          email: string | null
          id: string
          logo_url: string | null
          phone: string | null
          postal_code: string | null
          timezone: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          postal_code?: string | null
          timezone?: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          postal_code?: string | null
          timezone?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          balance: number | null
          city: string | null
          created_at: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          facility_id: string
          first_name: string | null
          id: string
          join_date: string | null
          last_name: string | null
          lease_end_date: string | null
          move_in_date: string | null
          notes: string | null
          phone: string | null
          security_deposit: number | null
          ssn: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          balance?: number | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          facility_id: string
          first_name?: string | null
          id?: string
          join_date?: string | null
          last_name?: string | null
          lease_end_date?: string | null
          move_in_date?: string | null
          notes?: string | null
          phone?: string | null
          security_deposit?: number | null
          ssn?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          balance?: number | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          facility_id?: string
          first_name?: string | null
          id?: string
          join_date?: string | null
          last_name?: string | null
          lease_end_date?: string | null
          move_in_date?: string | null
          notes?: string | null
          phone?: string | null
          security_deposit?: number | null
          ssn?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          is_active: boolean | null
          subject: string
          template_type: string
          tenant_id: string
          text_content: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          subject: string
          template_type: string
          tenant_id: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          subject?: string
          template_type?: string
          tenant_id?: string
          text_content?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      facilities: {
        Row: {
          address: string
          city: string
          country: string | null
          created_at: string | null
          custom_domain: string | null
          email: string | null
          id: string
          manager_id: string | null
          max_customers: number | null
          max_units: number | null
          name: string
          phone: string | null
          state: string | null
          subdomain: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tenant_id: string | null
          tenant_status: Database["public"]["Enums"]["tenant_status"] | null
          timezone: string | null
          trial_ends_at: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address: string
          city: string
          country?: string | null
          created_at?: string | null
          custom_domain?: string | null
          email?: string | null
          id?: string
          manager_id?: string | null
          max_customers?: number | null
          max_units?: number | null
          name: string
          phone?: string | null
          state?: string | null
          subdomain?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tenant_id?: string | null
          tenant_status?: Database["public"]["Enums"]["tenant_status"] | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string | null
          created_at?: string | null
          custom_domain?: string | null
          email?: string | null
          id?: string
          manager_id?: string | null
          max_customers?: number | null
          max_units?: number | null
          name?: string
          phone?: string | null
          state?: string | null
          subdomain?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tenant_id?: string | null
          tenant_status?: Database["public"]["Enums"]["tenant_status"] | null
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_default: boolean
          is_public: boolean | null
          last_used_at: string | null
          name: string
          parent_template_id: string | null
          preview_image_url: string | null
          tags: string[] | null
          template_data: Json
          updated_at: string
          usage_count: number | null
          version: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_default?: boolean
          is_public?: boolean | null
          last_used_at?: string | null
          name: string
          parent_template_id?: string | null
          preview_image_url?: string | null
          tags?: string[] | null
          template_data: Json
          updated_at?: string
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_default?: boolean
          is_public?: boolean | null
          last_used_at?: string | null
          name?: string
          parent_template_id?: string | null
          preview_image_url?: string | null
          tags?: string[] | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          customer_id: string
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          pdf_file_path: string | null
          status: string
          subtotal: number
          template_id: string | null
          total_amount: number
          unit_rental_id: string | null
          updated_at: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id: string
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          pdf_file_path?: string | null
          status?: string
          subtotal: number
          template_id?: string | null
          total_amount: number
          unit_rental_id?: string | null
          updated_at?: string
          vat_amount: number
          vat_rate?: number
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          pdf_file_path?: string | null
          status?: string
          subtotal?: number
          template_id?: string | null
          total_amount?: number
          unit_rental_id?: string | null
          updated_at?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_task_id: string | null
          created_at: string | null
          customer_id: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_task_id?: string | null
          created_at?: string | null
          customer_id: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_task_id?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_task_id_fkey"
            columns: ["assigned_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          description: string | null
          due_date: string
          id: string
          late_fee: number | null
          payment_date: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          unit_rental_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          description?: string | null
          due_date: string
          id?: string
          late_fee?: number | null
          payment_date?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          unit_rental_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          description?: string | null
          due_date?: string
          id?: string
          late_fee?: number | null
          payment_date?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          unit_rental_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_unit_rental_id_fkey"
            columns: ["unit_rental_id"]
            isOneToOne: false
            referencedRelation: "unit_rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          facility_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          facility_id?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          facility_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_cost: number | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          estimated_cost: number | null
          facility_id: string
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          facility_id: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          facility_id?: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      template_components: {
        Row: {
          component_data: Json
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          component_data: Json
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          component_data?: Json
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      template_usage_logs: {
        Row: {
          id: string
          invoice_id: string | null
          template_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          template_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string | null
          template_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_usage_logs_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_usage_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_branding: {
        Row: {
          accent_color: string | null
          company_name: string | null
          created_at: string | null
          custom_css: string | null
          email_from_address: string | null
          email_from_name: string | null
          favicon_url: string | null
          hide_lovable_badge: boolean | null
          id: string
          login_background_url: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          company_name?: string | null
          created_at?: string | null
          custom_css?: string | null
          email_from_address?: string | null
          email_from_name?: string | null
          favicon_url?: string | null
          hide_lovable_badge?: boolean | null
          id?: string
          login_background_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          company_name?: string | null
          created_at?: string | null
          custom_css?: string | null
          email_from_address?: string | null
          email_from_name?: string | null
          favicon_url?: string | null
          hide_lovable_badge?: boolean | null
          id?: string
          login_background_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_branding_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "facilities"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      tenant_features: {
        Row: {
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          feature_name: string
          id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          feature_name: string
          id?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          feature_name?: string
          id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_features_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      tenant_permissions: {
        Row: {
          created_at: string | null
          granted: boolean | null
          id: string
          permission_name: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission_name: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_permissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["tenant_id"]
          },
        ]
      }
      unit_comments: {
        Row: {
          author_id: string
          author_name: string
          comment_text: string
          created_at: string
          id: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          author_name: string
          comment_text: string
          created_at?: string
          id?: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          author_name?: string
          comment_text?: string
          created_at?: string
          id?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_comments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_price_history: {
        Row: {
          changed_by: string | null
          created_at: string
          effective_date: string
          id: string
          monthly_rate: number
          previous_rate: number | null
          reason: string | null
          unit_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          monthly_rate: number
          previous_rate?: number | null
          reason?: string | null
          unit_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          monthly_rate?: number
          previous_rate?: number | null
          reason?: string | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_price_history_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_rentals: {
        Row: {
          created_at: string | null
          customer_id: string
          end_date: string | null
          id: string
          is_active: boolean | null
          monthly_rate: number
          security_deposit: number | null
          start_date: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_rate: number
          security_deposit?: number | null
          start_date: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_rate?: number
          security_deposit?: number | null
          start_date?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_rentals_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          previous_status: Database["public"]["Enums"]["unit_status"] | null
          reason: string | null
          status: Database["public"]["Enums"]["unit_status"]
          unit_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          previous_status?: Database["public"]["Enums"]["unit_status"] | null
          reason?: string | null
          status: Database["public"]["Enums"]["unit_status"]
          unit_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          previous_status?: Database["public"]["Enums"]["unit_status"] | null
          reason?: string | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_status_history_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          climate_controlled: boolean | null
          created_at: string | null
          description: string | null
          facility_id: string
          floor_level: number | null
          id: string
          monthly_rate: number
          size: string
          status: Database["public"]["Enums"]["unit_status"] | null
          type: string | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          climate_controlled?: boolean | null
          created_at?: string | null
          description?: string | null
          facility_id: string
          floor_level?: number | null
          id?: string
          monthly_rate: number
          size: string
          status?: Database["public"]["Enums"]["unit_status"] | null
          type?: string | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          climate_controlled?: boolean | null
          created_at?: string | null
          description?: string | null
          facility_id?: string
          floor_level?: number | null
          id?: string
          monthly_rate?: number
          size?: string
          status?: Database["public"]["Enums"]["unit_status"] | null
          type?: string | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      feature_enabled: {
        Args: { feature_name: string }
        Returns: boolean
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_customer_facility_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_facility_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
    }
    Enums: {
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_tier:
        | "starter"
        | "professional"
        | "enterprise"
        | "enterprise_plus"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
      tenant_status: "active" | "suspended" | "trial" | "canceled"
      unit_status: "available" | "occupied" | "reserved" | "maintenance"
      user_role: "admin" | "manager" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_tier: [
        "starter",
        "professional",
        "enterprise",
        "enterprise_plus",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
      tenant_status: ["active", "suspended", "trial", "canceled"],
      unit_status: ["available", "occupied", "reserved", "maintenance"],
      user_role: ["admin", "manager", "customer"],
    },
  },
} as const
