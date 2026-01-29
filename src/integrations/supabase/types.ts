export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ambitions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          leader_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          leader_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambitions_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      intern_project_tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'on_hold' | 'done'
          due_date: string | null
          created_by: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'on_hold' | 'done'
          due_date?: string | null
          created_by: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'on_hold' | 'done'
          due_date?: string | null
          created_by?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intern_project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intern_project_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intern_project_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intern_task_updates: {
        Row: {
          id: string
          task_id: string
          user_id: string
          update_text: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          update_text: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          update_text?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intern_task_updates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "intern_project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intern_task_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intern_task_attachments: {
        Row: {
          id: string
          task_id: string
          file_name: string
          file_url: string
          file_size: number | null
          file_type: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          file_type?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          file_type?: string | null
          uploaded_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intern_task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "intern_project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intern_task_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      }
      objectives: {
        Row: {
          created_at: string
          description: string
          id: string
          project_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "objectives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_join_requests: {
        Row: {
          applicant_comment: string | null
          created_at: string
          id: string
          pm_comment: string | null
          project_id: string | null
          role_id: string | null
          status: Database["public"]["Enums"]["join_request_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          applicant_comment?: string | null
          created_at?: string
          id?: string
          pm_comment?: string | null
          project_id?: string | null
          role_id?: string | null
          status?: Database["public"]["Enums"]["join_request_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          applicant_comment?: string | null
          created_at?: string
          id?: string
          pm_comment?: string | null
          project_id?: string | null
          role_id?: string | null
          status?: Database["public"]["Enums"]["join_request_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_join_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_join_requests_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_join_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_products: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          project_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          project_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_products_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_roles: {
        Row: {
          count: number
          created_at: string
          id: string
          project_id: string | null
          role_id: string | null
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          project_id?: string | null
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          project_id?: string | null
          role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_skills: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          skill_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          skill_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      project_staff: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          project_role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          project_role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          project_role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_staff_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          ambition_id: string | null
          applications_status:
            | Database["public"]["Enums"]["application_status"]
            | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          name: string
          pm_id: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string
        }
        Insert: {
          ambition_id?: string | null
          applications_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name: string
          pm_id?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
        }
        Update: {
          ambition_id?: string | null
          applications_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name?: string
          pm_id?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_ambition_id_fkey"
            columns: ["ambition_id"]
            isOneToOne: false
            referencedRelation: "ambitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_pm_id_fkey"
            columns: ["pm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_products: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_projects: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          access_role: string | null
          created_at: string
          display_name: string | null
          email: string
          experience: string | null
          id: string
          interests: string[] | null
          name: string | null
          password: string | null
          role_id: string | null
          updated_at: string
          watsonx_api_key: string | null
          weekly_availability: number | null
        }
        Insert: {
          access_role?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          experience?: string | null
          id?: string
          interests?: string[] | null
          name?: string | null
          password?: string | null
          role_id?: string | null
          updated_at?: string
          watsonx_api_key?: string | null
          weekly_availability?: number | null
        }
        Update: {
          access_role?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          experience?: string | null
          id?: string
          interests?: string[] | null
          name?: string | null
          password?: string | null
          role_id?: string | null
          updated_at?: string
          watsonx_api_key?: string | null
          weekly_availability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_ambition: {
        Args: {
          description_param: string
          leader_id_param: string
          name_param: string
        }
        Returns: string
      }
      create_project: {
        Args: {
          ambition_id_param: string
          deadline_param?: string
          description_param: string
          name_param: string
          pm_id_param: string
        }
        Returns: string
      }
      create_project_join_request: {
        Args: {
          applicant_comment_param?: string
          project_id_param: string
          role_id_param: string
          user_id_param: string
        }
        Returns: string
      }
      create_project_product: {
        Args: { product_id_param: string; project_id_param: string }
        Returns: string
      }
      create_project_skill: {
        Args: { project_id_param: string; skill_id_param: string }
        Returns: string
      }
      create_project_staff: {
        Args: {
          project_id_param: string
          project_role_param: string
          user_id_param: string
        }
        Returns: string
      }
      delete_ambition: {
        Args: { ambition_id_param: string }
        Returns: boolean
      }
      delete_project: {
        Args: { project_id_param: string }
        Returns: boolean
      }
      get_ambitions: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          id: string
          leader_id: string
          leader_name: string
          name: string
        }[]
      }
      get_join_requests_by_pm_id: {
        Args: { pm_id_param: string }
        Returns: {
          applicant_comment: string
          created_at: string
          id: string
          pm_comment: string
          project_id: string
          project_name: string
          role_id: string
          role_name: string
          status: Database["public"]["Enums"]["join_request_status"]
          user_email: string
          user_id: string
        }[]
      }
      get_join_requests_by_project: {
        Args: { project_id_param: string }
        Returns: {
          applicant_comment: string
          created_at: string
          id: string
          pm_comment: string
          role_id: string
          role_name: string
          status: Database["public"]["Enums"]["join_request_status"]
          user_email: string
          user_id: string
        }[]
      }
      get_project_applicant_count: {
        Args: { project_id_param: string }
        Returns: number
      }
      get_project_staff_by_project: {
        Args: { project_id_param: string }
        Returns: {
          created_at: string
          id: string
          project_role: string
          user_email: string
          user_id: string
        }[]
      }
      get_project_working_count: {
        Args: { project_id_param: string }
        Returns: number
      }
      get_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          ambition_name: string
          applications_status: Database["public"]["Enums"]["application_status"]
          created_at: string
          deadline: string
          description: string
          id: string
          name: string
          pm_name: string
          status: Database["public"]["Enums"]["project_status"]
        }[]
      }
      get_projects_by_pm_id: {
        Args: { pm_id_param: string }
        Returns: {
          ambition_name: string
          applications_status: Database["public"]["Enums"]["application_status"]
          created_at: string
          deadline: string
          description: string
          id: string
          name: string
          status: Database["public"]["Enums"]["project_status"]
        }[]
      }
      get_projects_by_staff: {
        Args: { user_id_param: string }
        Returns: {
          applications_status: Database["public"]["Enums"]["application_status"]
          created_at: string
          deadline: string
          description: string
          id: string
          name: string
          project_role: string
          status: Database["public"]["Enums"]["project_status"]
        }[]
      }
      get_projects_enhanced: {
        Args: Record<PropertyKey, never>
        Returns: {
          ambition_name: string
          applicant_count: number
          applications_status: Database["public"]["Enums"]["application_status"]
          created_at: string
          deadline: string
          description: string
          id: string
          name: string
          pm_email: string
          pm_name: string
          products: string[]
          roles: Json
          skills: string[]
          status: Database["public"]["Enums"]["project_status"]
          working_count: number
        }[]
      }
      get_user_by_user_id: {
        Args: { user_id_param: string }
        Returns: {
          access_role: string
          created_at: string
          email: string
          id: string
          interests: string[]
          role_id: string
          role_name: string
        }[]
      }
      get_user_join_requests: {
        Args: { user_id_param: string }
        Returns: {
          applicant_comment: string
          created_at: string
          id: string
          pm_comment: string
          project_id: string
          project_name: string
          role_name: string
          status: Database["public"]["Enums"]["join_request_status"]
        }[]
      }
      update_join_request_status: {
        Args: {
          new_status: Database["public"]["Enums"]["join_request_status"]
          pm_comment_param?: string
          request_id_param: string
        }
        Returns: boolean
      }
      update_project_staff: {
        Args: { new_role: string; staff_id_param: string }
        Returns: boolean
      }
      update_project_status: {
        Args: {
          new_status: Database["public"]["Enums"]["project_status"]
          project_id_param: string
        }
        Returns: boolean
      }
      update_user: {
        Args: {
          access_role_param?: string
          email_param?: string
          interests_param?: string[]
          role_id_param?: string
          user_id_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      application_status: "open" | "closed"
      join_request_status: "pending" | "approved" | "declined"
      project_status: "not started" | "in progress" | "complete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["open", "closed"],
      join_request_status: ["pending", "approved", "declined"],
      project_status: ["not started", "in progress", "complete"],
    },
  },
} as const
