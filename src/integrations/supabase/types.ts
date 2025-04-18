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
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          business_model: string | null
          challenges: string | null
          communication_platforms: Json | null
          community_structure: string | null
          community_type: string | null
          community_values: string | null
          created_at: string
          description: string | null
          event_formats: string | null
          event_frequency: string | null
          event_platforms: Json | null
          format: string | null
          founder_name: string | null
          id: string
          is_public: boolean
          location: string | null
          logo_url: string | null
          member_count: number | null
          name: string
          newsletter_url: string | null
          notification_platforms: Json | null
          owner_id: string | null
          personal_background: string | null
          role_title: string | null
          size_demographics: string | null
          social_media: Json | null
          special_notes: string | null
          start_date: string | null
          target_audience: string[] | null
          team_structure: string | null
          tech_stack: string | null
          updated_at: string
          vision: string | null
          website: string | null
        }
        Insert: {
          business_model?: string | null
          challenges?: string | null
          communication_platforms?: Json | null
          community_structure?: string | null
          community_type?: string | null
          community_values?: string | null
          created_at?: string
          description?: string | null
          event_formats?: string | null
          event_frequency?: string | null
          event_platforms?: Json | null
          format?: string | null
          founder_name?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          logo_url?: string | null
          member_count?: number | null
          name: string
          newsletter_url?: string | null
          notification_platforms?: Json | null
          owner_id?: string | null
          personal_background?: string | null
          role_title?: string | null
          size_demographics?: string | null
          social_media?: Json | null
          special_notes?: string | null
          start_date?: string | null
          target_audience?: string[] | null
          team_structure?: string | null
          tech_stack?: string | null
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Update: {
          business_model?: string | null
          challenges?: string | null
          communication_platforms?: Json | null
          community_structure?: string | null
          community_type?: string | null
          community_values?: string | null
          created_at?: string
          description?: string | null
          event_formats?: string | null
          event_frequency?: string | null
          event_platforms?: Json | null
          format?: string | null
          founder_name?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          logo_url?: string | null
          member_count?: number | null
          name?: string
          newsletter_url?: string | null
          notification_platforms?: Json | null
          owner_id?: string | null
          personal_background?: string | null
          role_title?: string | null
          size_demographics?: string | null
          social_media?: Json | null
          special_notes?: string | null
          start_date?: string | null
          target_audience?: string[] | null
          team_structure?: string | null
          tech_stack?: string | null
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Relationships: []
      }
      community_data: {
        Row: {
          community_id: string
          data: Json
          data_type: string
          id: string
          imported_at: string
          imported_by: string | null
          metadata: Json | null
        }
        Insert: {
          community_id: string
          data: Json
          data_type: string
          id?: string
          imported_at?: string
          imported_by?: string | null
          metadata?: Json | null
        }
        Update: {
          community_id?: string
          data?: Json
          data_type?: string
          id?: string
          imported_at?: string
          imported_by?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "community_data_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_organizer_profiles: {
        Row: {
          business_model: string | null
          challenges: string | null
          community_id: string | null
          community_structure: string | null
          community_values: string | null
          created_at: string | null
          event_formats: string | null
          founder_name: string
          id: string
          personal_background: string | null
          size_demographics: string | null
          special_notes: string | null
          team_structure: string | null
          tech_stack: string | null
          updated_at: string | null
          vision: string | null
        }
        Insert: {
          business_model?: string | null
          challenges?: string | null
          community_id?: string | null
          community_structure?: string | null
          community_values?: string | null
          created_at?: string | null
          event_formats?: string | null
          founder_name: string
          id?: string
          personal_background?: string | null
          size_demographics?: string | null
          special_notes?: string | null
          team_structure?: string | null
          tech_stack?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Update: {
          business_model?: string | null
          challenges?: string | null
          community_id?: string | null
          community_structure?: string | null
          community_values?: string | null
          created_at?: string | null
          event_formats?: string | null
          founder_name?: string
          id?: string
          personal_background?: string | null
          size_demographics?: string | null
          special_notes?: string | null
          team_structure?: string | null
          tech_stack?: string | null
          updated_at?: string | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_organizer_profiles_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
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
      get_community_admin_status: {
        Args: { user_id: string; community_id: string }
        Returns: boolean
      }
      get_highest_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_memberships: {
        Args: { user_id: string }
        Returns: {
          community_id: string
          role: string
        }[]
      }
      get_user_owned_communities: {
        Args: { user_id: string }
        Returns: {
          community_id: string
          role: string
        }[]
      }
      get_user_roles: {
        Args: { user_id: string }
        Returns: string[]
      }
      has_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_community_owner: {
        Args: { user_id: string; community_id: string }
        Returns: boolean
      }
      log_audit_action: {
        Args: {
          action_name: string
          performer_id: string
          target_id?: string
          action_details?: Json
        }
        Returns: undefined
      }
      safe_delete_community: {
        Args: { community_id: string; user_id: string }
        Returns: boolean
      }
      update_user_role: {
        Args: { p_user_id: string; p_role_name: string; p_assigner_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
