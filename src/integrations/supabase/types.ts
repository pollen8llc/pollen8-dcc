export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      communities: {
        Row: {
          communication_platforms: Json | null
          created_at: string
          description: string | null
          format: string | null
          id: string
          is_public: boolean | null
          location: string | null
          logo_url: string | null
          member_count: string | null
          name: string
          newsletter_url: string | null
          owner_id: string
          social_media: Json | null
          tags: string[] | null
          target_audience: string[] | null
          type: string | null
          updated_at: string
          vision: string | null
          website: string | null
        }
        Insert: {
          communication_platforms?: Json | null
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          logo_url?: string | null
          member_count?: string | null
          name: string
          newsletter_url?: string | null
          owner_id: string
          social_media?: Json | null
          tags?: string[] | null
          target_audience?: string[] | null
          type?: string | null
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Update: {
          communication_platforms?: Json | null
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          logo_url?: string | null
          member_count?: string | null
          name?: string
          newsletter_url?: string | null
          owner_id?: string
          social_media?: Json | null
          tags?: string[] | null
          target_audience?: string[] | null
          type?: string | null
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
          imported_by: string
          metadata: Json | null
        }
        Insert: {
          community_id: string
          data?: Json
          data_type: string
          id?: string
          imported_at?: string
          imported_by: string
          metadata?: Json | null
        }
        Update: {
          community_id?: string
          data?: Json
          data_type?: string
          id?: string
          imported_at?: string
          imported_by?: string
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
      community_data_distribution: {
        Row: {
          community_id: string | null
          created_at: string
          error_message: string | null
          id: string
          processed_at: string | null
          status: string
          submission_data: Json
          submitter_id: string
        }
        Insert: {
          community_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          submission_data: Json
          submitter_id: string
        }
        Update: {
          community_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          submission_data?: Json
          submitter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_data_distribution_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          invited_by: string | null
          joined_at: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          author_id: string
          category: string | null
          community_id: string
          content: string
          created_at: string
          id: string
          is_published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          community_id: string
          content: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_responses: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          communities: string[] | null
          created_at: string
          eco8_setup_complete: boolean | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          is_profile_complete: boolean | null
          labr8_setup_complete: boolean | null
          last_login_at: string | null
          last_name: string | null
          location: string | null
          managed_communities: string[] | null
          modul8_setup_complete: boolean | null
          nmn8_setup_complete: boolean | null
          onboarding_complete: boolean | null
          phone: string | null
          privacy_settings: Json | null
          profile_complete: boolean | null
          rel8_complete: boolean | null
          role: string | null
          skills: string[] | null
          social_links: Json | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          communities?: string[] | null
          created_at?: string
          eco8_setup_complete?: boolean | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_profile_complete?: boolean | null
          labr8_setup_complete?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          managed_communities?: string[] | null
          modul8_setup_complete?: boolean | null
          nmn8_setup_complete?: boolean | null
          onboarding_complete?: boolean | null
          phone?: string | null
          privacy_settings?: Json | null
          profile_complete?: boolean | null
          rel8_complete?: boolean | null
          role?: string | null
          skills?: string[] | null
          social_links?: Json | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          communities?: string[] | null
          created_at?: string
          eco8_setup_complete?: boolean | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_profile_complete?: boolean | null
          labr8_setup_complete?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          managed_communities?: string[] | null
          modul8_setup_complete?: boolean | null
          nmn8_setup_complete?: boolean | null
          onboarding_complete?: boolean | null
          phone?: string | null
          privacy_settings?: Json | null
          profile_complete?: boolean | null
          rel8_complete?: boolean | null
          role?: string | null
          skills?: string[] | null
          social_links?: Json | null
          updated_at?: string
          user_id?: string
          website?: string | null
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
      create_community: {
        Args: {
          p_description: string
          p_format?: string
          p_is_public?: boolean
          p_location?: string
          p_name: string
          p_tags?: string[]
          p_target_audience?: string[]
          p_type?: string
          p_website?: string
        }
        Returns: string
      }
      get_community_member_count: {
        Args: { community_id: string }
        Returns: number
      }
      get_highest_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_managed_communities: {
        Args: { user_id: string }
        Returns: {
          community_id: string
          community_name: string
          member_count: number
        }[]
      }
      get_managed_communities_detailed: {
        Args: { user_id: string }
        Returns: {
          community_id: string
          community_name: string
          created_at: string
          is_public: boolean
          member_count: number
          type: string
        }[]
      }
      get_poll_counts: {
        Args: { poll_id: string }
        Returns: {
          count: number
          option_index: number
        }[]
      }
      get_user_profile_with_role: {
        Args: { user_id: string }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          eco8_setup_complete: boolean
          email: string
          first_name: string
          full_name: string
          id: string
          interests: string[]
          is_profile_complete: boolean
          labr8_setup_complete: boolean
          last_name: string
          location: string
          modul8_setup_complete: boolean
          nmn8_setup_complete: boolean
          onboarding_complete: boolean
          phone: string
          privacy_settings: Json
          rel8_complete: boolean
          role: string
          skills: string[]
          social_links: Json
          updated_at: string
          user_id: string
          website: string
        }[]
      }
      get_user_roles: {
        Args: { user_id: string }
        Returns: {
          assigned_at: string
          role_description: string
          role_name: string
        }[]
      }
      has_role: {
        Args: { role_name: string; user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_community_owner: {
        Args: { community_id: string; user_id: string }
        Returns: boolean
      }
      update_module_completion: {
        Args: { is_complete?: boolean; module_name: string; user_id: string }
        Returns: boolean
      }
      update_user_role: {
        Args: { p_assigner_id?: string; p_role_name: string; p_user_id: string }
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
    Enums: {},
  },
} as const
