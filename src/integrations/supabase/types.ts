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
      admin_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          communication_platforms: Json | null
          created_at: string
          description: string | null
          format: string | null
          id: string
          is_public: boolean
          location: string | null
          logo_url: string | null
          member_count: string | null
          name: string
          newsletter_url: string | null
          owner_id: string
          social_media: Json | null
          tags: string[] | null
          target_audience: Json | null
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
          is_public?: boolean
          location?: string | null
          logo_url?: string | null
          member_count?: string | null
          name: string
          newsletter_url?: string | null
          owner_id: string
          social_media?: Json | null
          tags?: string[] | null
          target_audience?: Json | null
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
          is_public?: boolean
          location?: string | null
          logo_url?: string | null
          member_count?: string | null
          name?: string
          newsletter_url?: string | null
          owner_id?: string
          social_media?: Json | null
          tags?: string[] | null
          target_audience?: Json | null
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
      cross_platform_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          platform: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          platform?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          platform?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_platform_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cross_platform_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_platform_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      eco8_community_posts: {
        Row: {
          author_id: string
          community_id: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          post_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          community_id: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          post_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          post_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      eco8_event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          registration_status: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          registration_status?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          registration_status?: string
          user_id?: string
        }
        Relationships: []
      }
      eco8_events: {
        Row: {
          community_id: string
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          max_attendees: number | null
          registration_required: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          community_id: string
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          community_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      eco8_post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          code: string
          created_at: string
          creator_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          link_id: string
          max_uses: number | null
          updated_at: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          creator_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          link_id: string
          max_uses?: number | null
          updated_at?: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          creator_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          link_id?: string
          max_uses?: number | null
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      iotas: {
        Row: {
          created_at: string
          cultiv8_posts: number
          eco8_communities: number
          id: string
          rel8_contacts: number
          total_network_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cultiv8_posts?: number
          eco8_communities?: number
          id?: string
          rel8_contacts?: number
          total_network_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cultiv8_posts?: number
          eco8_communities?: number
          id?: string
          rel8_contacts?: number
          total_network_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "iotas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      knowledge_articles: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          author_id: string
          category: string | null
          comment_count: number | null
          community_id: string | null
          content: string
          content_type: string | null
          created_at: string
          has_accepted_answer: boolean | null
          id: string
          is_answered: boolean | null
          is_featured: boolean | null
          is_published: boolean | null
          options: Json | null
          source: string | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
          vote_count: number | null
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          author_id: string
          category?: string | null
          comment_count?: number | null
          community_id?: string | null
          content: string
          content_type?: string | null
          created_at?: string
          has_accepted_answer?: boolean | null
          id?: string
          is_answered?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          options?: Json | null
          source?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
          vote_count?: number | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          author_id?: string
          category?: string | null
          comment_count?: number | null
          community_id?: string | null
          content?: string
          content_type?: string | null
          created_at?: string
          has_accepted_answer?: boolean | null
          id?: string
          is_answered?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          options?: Json | null
          source?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
          vote_count?: number | null
        }
        Relationships: []
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
      knowledge_comment_mentions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          mentioned_user_id: string
          mentioned_username: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          mentioned_user_id: string
          mentioned_username: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          mentioned_user_id?: string
          mentioned_username?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_comment_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "knowledge_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_comment_mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      knowledge_comments: {
        Row: {
          article_id: string
          author_id: string
          content: string
          created_at: string
          id: string
          is_accepted_answer: boolean | null
          parent_comment_id: string | null
          reply_count: number | null
          updated_at: string
        }
        Insert: {
          article_id: string
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_accepted_answer?: boolean | null
          parent_comment_id?: string | null
          reply_count?: number | null
          updated_at?: string
        }
        Update: {
          article_id?: string
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_accepted_answer?: boolean | null
          parent_comment_id?: string | null
          reply_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "knowledge_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "knowledge_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_saved_articles: {
        Row: {
          article_id: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_saved_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_saved_articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      knowledge_tags: {
        Row: {
          color: string | null
          count: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          count?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          count?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      knowledge_votes: {
        Row: {
          article_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          article_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          article_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_votes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "knowledge_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lexicon: {
        Row: {
          created_at: string | null
          first_used_at: string | null
          first_user_id: string | null
          id: string
          is_active: boolean | null
          is_suggested: boolean | null
          last_used_at: string | null
          metadata: Json | null
          source_module: string | null
          term: string
          term_type: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          first_used_at?: string | null
          first_user_id?: string | null
          id?: string
          is_active?: boolean | null
          is_suggested?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          source_module?: string | null
          term: string
          term_type: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          first_used_at?: string | null
          first_user_id?: string | null
          id?: string
          is_active?: boolean | null
          is_suggested?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          source_module?: string | null
          term?: string
          term_type?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      lexicon_usage: {
        Row: {
          id: string
          lexicon_id: string
          source_field: string
          source_record_id: string
          source_table: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          lexicon_id: string
          source_field: string
          source_record_id: string
          source_table: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          lexicon_id?: string
          source_field?: string
          source_record_id?: string
          source_table?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lexicon_usage_lexicon_id_fkey"
            columns: ["lexicon_id"]
            isOneToOne: false
            referencedRelation: "lexicon"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          aliases: string[] | null
          city_name: string | null
          country_code: string | null
          created_at: string | null
          formatted_address: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          parent_location_id: string | null
          source: string | null
          state_code: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          aliases?: string[] | null
          city_name?: string | null
          country_code?: string | null
          created_at?: string | null
          formatted_address: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          parent_location_id?: string | null
          source?: string | null
          state_code?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          aliases?: string[] | null
          city_name?: string | null
          country_code?: string | null
          created_at?: string | null
          formatted_address?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          parent_location_id?: string | null
          source?: string | null
          state_code?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_deals: {
        Row: {
          created_at: string
          deal_amount: number | null
          deal_status: string
          id: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          signed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_amount?: number | null
          deal_status?: string
          id?: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          signed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_amount?: number | null
          deal_status?: string
          id?: string
          organizer_id?: string
          service_provider_id?: string
          service_request_id?: string
          signed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      modul8_negotiation_status: {
        Row: {
          created_at: string
          current_status: string
          id: string
          organizer_id: string | null
          previous_status: string | null
          service_provider_id: string | null
          service_request_id: string
          status_data: Json | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          current_status: string
          id?: string
          organizer_id?: string | null
          previous_status?: string | null
          service_provider_id?: string | null
          service_request_id: string
          status_data?: Json | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          current_status?: string
          id?: string
          organizer_id?: string | null
          previous_status?: string | null
          service_provider_id?: string | null
          service_request_id?: string
          status_data?: Json | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      modul8_organizers: {
        Row: {
          budget_range: string | null
          company_size: string | null
          created_at: string
          description: string | null
          focus_areas: string[] | null
          id: string
          industry: string | null
          logo_url: string | null
          organization_name: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          budget_range?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          organization_name?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          budget_range?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          organization_name?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modul8_organizers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      modul8_project_comments: {
        Row: {
          comment_type: string
          content: string
          created_at: string
          id: string
          metadata: Json | null
          service_request_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_type?: string
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          service_request_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_type?: string
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          service_request_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_project_comments_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_project_completions: {
        Row: {
          completed_at: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          deliverables: Json | null
          id: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          deliverables?: Json | null
          id?: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          deliverables?: Json | null
          id?: string
          organizer_id?: string
          service_provider_id?: string
          service_request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      modul8_project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          order_index: number
          service_request_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          service_request_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          service_request_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      modul8_project_ratings: {
        Row: {
          completion_id: string
          created_at: string
          feedback: string | null
          id: string
          organizer_id: string
          rating: number | null
          service_provider_id: string
          service_request_id: string
          updated_at: string
        }
        Insert: {
          completion_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          organizer_id: string
          rating?: number | null
          service_provider_id: string
          service_request_id: string
          updated_at?: string
        }
        Update: {
          completion_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          organizer_id?: string
          rating?: number | null
          service_provider_id?: string
          service_request_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      modul8_project_revisions: {
        Row: {
          created_at: string
          id: string
          requested_by: string
          revision_details: string
          service_request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_by: string
          revision_details: string
          service_request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_by?: string
          revision_details?: string
          service_request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      modul8_proposal_card_responses: {
        Row: {
          card_id: string
          created_at: string
          id: string
          response_notes: string | null
          response_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          response_notes?: string | null
          response_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          response_notes?: string | null
          response_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_proposal_card_responses_card_id"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "modul8_proposal_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_proposal_cards: {
        Row: {
          asset_links: string[] | null
          card_number: number | null
          created_at: string
          deel_contract_url: string | null
          description: string | null
          id: string
          is_locked: boolean | null
          negotiated_budget_range: Json | null
          negotiated_description: string | null
          negotiated_timeline: string | null
          negotiated_title: string | null
          notes: string | null
          proposed_budget: number | null
          proposed_timeline: string | null
          provider_id: string
          request_id: string
          responded_at: string | null
          responded_by: string | null
          response_to_card_id: string | null
          scope_link: string | null
          status: string
          submitted_by: string | null
          terms_link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          asset_links?: string[] | null
          card_number?: number | null
          created_at?: string
          deel_contract_url?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          negotiated_budget_range?: Json | null
          negotiated_description?: string | null
          negotiated_timeline?: string | null
          negotiated_title?: string | null
          notes?: string | null
          proposed_budget?: number | null
          proposed_timeline?: string | null
          provider_id: string
          request_id: string
          responded_at?: string | null
          responded_by?: string | null
          response_to_card_id?: string | null
          scope_link?: string | null
          status?: string
          submitted_by?: string | null
          terms_link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          asset_links?: string[] | null
          card_number?: number | null
          created_at?: string
          deel_contract_url?: string | null
          description?: string | null
          id?: string
          is_locked?: boolean | null
          negotiated_budget_range?: Json | null
          negotiated_description?: string | null
          negotiated_timeline?: string | null
          negotiated_title?: string | null
          notes?: string | null
          proposed_budget?: number | null
          proposed_timeline?: string | null
          provider_id?: string
          request_id?: string
          responded_at?: string | null
          responded_by?: string | null
          response_to_card_id?: string | null
          scope_link?: string | null
          status?: string
          submitted_by?: string | null
          terms_link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      modul8_proposal_threads: {
        Row: {
          created_at: string
          id: string
          service_request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          service_request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_proposal_threads_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_proposal_versions: {
        Row: {
          change_notes: string | null
          changes_summary: string | null
          created_at: string
          created_by: string
          id: string
          proposal_id: string
          proposed_budget: number | null
          proposed_timeline: string | null
          thread_id: string
          updated_at: string
          version_number: number
        }
        Insert: {
          change_notes?: string | null
          changes_summary?: string | null
          created_at?: string
          created_by: string
          id?: string
          proposal_id: string
          proposed_budget?: number | null
          proposed_timeline?: string | null
          thread_id: string
          updated_at?: string
          version_number?: number
        }
        Update: {
          change_notes?: string | null
          changes_summary?: string | null
          created_at?: string
          created_by?: string
          id?: string
          proposal_id?: string
          proposed_budget?: number | null
          proposed_timeline?: string | null
          thread_id?: string
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "modul8_proposal_versions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "modul8_proposal_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_proposal_versions_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "modul8_proposal_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_proposals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          proposed_budget: number | null
          proposed_timeline: string | null
          service_provider_id: string
          service_request_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          proposed_budget?: number | null
          proposed_timeline?: string | null
          service_provider_id: string
          service_request_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          proposed_budget?: number | null
          proposed_timeline?: string | null
          service_provider_id?: string
          service_request_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      modul8_service_providers: {
        Row: {
          availability_status: string | null
          business_name: string | null
          created_at: string
          description: string | null
          domain_specializations: number[] | null
          id: string
          logo_url: string | null
          portfolio_links: string[] | null
          pricing_model: string | null
          pricing_range: Json | null
          rating: number | null
          services: string[] | null
          services_offered: string[] | null
          tagline: string | null
          tags: string[] | null
          total_projects: number | null
          updated_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          availability_status?: string | null
          business_name?: string | null
          created_at?: string
          description?: string | null
          domain_specializations?: number[] | null
          id?: string
          logo_url?: string | null
          portfolio_links?: string[] | null
          pricing_model?: string | null
          pricing_range?: Json | null
          rating?: number | null
          services?: string[] | null
          services_offered?: string[] | null
          tagline?: string | null
          tags?: string[] | null
          total_projects?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          availability_status?: string | null
          business_name?: string | null
          created_at?: string
          description?: string | null
          domain_specializations?: number[] | null
          id?: string
          logo_url?: string | null
          portfolio_links?: string[] | null
          pricing_model?: string | null
          pricing_range?: Json | null
          rating?: number | null
          services?: string[] | null
          services_offered?: string[] | null
          tagline?: string | null
          tags?: string[] | null
          total_projects?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modul8_service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      modul8_service_request_comments: {
        Row: {
          comment_type: string
          content: string
          created_at: string
          id: string
          metadata: Json | null
          service_request_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_type?: string
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          service_request_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_type?: string
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          service_request_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modul8_service_requests: {
        Row: {
          budget_range: string | null
          created_at: string
          description: string
          domain_page: number | null
          engagement_status: string | null
          id: string
          is_agreement_locked: boolean | null
          organizer_id: string
          project_progress: number | null
          service_provider_id: string | null
          status: string
          timeline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          description: string
          domain_page?: number | null
          engagement_status?: string | null
          id?: string
          is_agreement_locked?: boolean | null
          organizer_id: string
          project_progress?: number | null
          service_provider_id?: string | null
          status?: string
          timeline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          description?: string
          domain_page?: number | null
          engagement_status?: string | null
          id?: string
          is_agreement_locked?: boolean | null
          organizer_id?: string
          project_progress?: number | null
          service_provider_id?: string | null
          status?: string
          timeline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_service_requests_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "modul8_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_service_requests_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      nmn8_group_configs: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          organizer_id: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organizer_id: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organizer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      nmn8_nominations: {
        Row: {
          contact_id: string
          created_at: string
          groups: Json
          id: string
          notes: string | null
          organizer_id: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          groups?: Json
          id?: string
          notes?: string | null
          organizer_id: string
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          groups?: Json
          id?: string
          notes?: string | null
          organizer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_nmn8_nominations_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      nmn8_profiles: {
        Row: {
          classification: string
          community_engagement: number
          contact_id: string
          created_at: string
          events_attended: number
          id: string
          interests: string[] | null
          last_active: string | null
          notes: string | null
          organizer_id: string
          social_media: Json | null
          updated_at: string
        }
        Insert: {
          classification?: string
          community_engagement?: number
          contact_id: string
          created_at?: string
          events_attended?: number
          id?: string
          interests?: string[] | null
          last_active?: string | null
          notes?: string | null
          organizer_id: string
          social_media?: Json | null
          updated_at?: string
        }
        Update: {
          classification?: string
          community_engagement?: number
          contact_id?: string
          created_at?: string
          events_attended?: number
          id?: string
          interests?: string[] | null
          last_active?: string | null
          notes?: string | null
          organizer_id?: string
          social_media?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      nmn8_settings: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          organizer_id: string
          setting_type: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organizer_id: string
          setting_type: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organizer_id?: string
          setting_type?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
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
          eco8_complete: boolean | null
          eco8_setup_complete: boolean | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          invited_by: string | null
          is_profile_complete: boolean | null
          labr8_complete: boolean | null
          labr8_setup_complete: boolean | null
          last_login_at: string | null
          last_name: string | null
          location: string | null
          managed_communities: string[] | null
          modul8_complete: boolean | null
          modul8_setup_complete: boolean | null
          network_score: number | null
          network_value: number
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
          eco8_complete?: boolean | null
          eco8_setup_complete?: boolean | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          invited_by?: string | null
          is_profile_complete?: boolean | null
          labr8_complete?: boolean | null
          labr8_setup_complete?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          managed_communities?: string[] | null
          modul8_complete?: boolean | null
          modul8_setup_complete?: boolean | null
          network_score?: number | null
          network_value?: number
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
          eco8_complete?: boolean | null
          eco8_setup_complete?: boolean | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          invited_by?: string | null
          is_profile_complete?: boolean | null
          labr8_complete?: boolean | null
          labr8_setup_complete?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          managed_communities?: string[] | null
          modul8_complete?: boolean | null
          modul8_setup_complete?: boolean | null
          network_score?: number | null
          network_value?: number
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
      rms_contact_affiliations: {
        Row: {
          affiliated_community_id: string | null
          affiliated_contact_id: string | null
          affiliated_user_id: string | null
          affiliation_type: string
          contact_id: string
          created_at: string
          id: string
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliated_community_id?: string | null
          affiliated_contact_id?: string | null
          affiliated_user_id?: string | null
          affiliation_type: string
          contact_id: string
          created_at?: string
          id?: string
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliated_community_id?: string | null
          affiliated_contact_id?: string | null
          affiliated_user_id?: string | null
          affiliation_type?: string
          contact_id?: string
          created_at?: string
          id?: string
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_contact_affiliations_affiliated_community_id_fkey"
            columns: ["affiliated_community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_contact_affiliations_affiliated_contact_id_fkey"
            columns: ["affiliated_contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_contact_affiliations_affiliated_user_id_fkey"
            columns: ["affiliated_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rms_contact_affiliations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_contact_affiliations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rms_contact_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      rms_contact_group_members: {
        Row: {
          added_at: string
          added_by: string
          contact_id: string
          group_id: string
          id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          contact_id: string
          group_id: string
          id?: string
        }
        Update: {
          added_at?: string
          added_by?: string
          contact_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_contact_group_members_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rms_contact_group_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_contact_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "rms_contact_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      rms_contact_groups: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_contact_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rms_contacts: {
        Row: {
          bio: string | null
          category_id: string | null
          created_at: string
          email: string | null
          id: string
          interests: string[] | null
          last_contact_date: string | null
          last_introduction_date: string | null
          location: string | null
          name: string
          notes: string | null
          organization: string | null
          phone: string | null
          role: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          category_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interests?: string[] | null
          last_contact_date?: string | null
          last_introduction_date?: string | null
          location?: string | null
          name: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          category_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interests?: string[] | null
          last_contact_date?: string | null
          last_introduction_date?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_contacts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "rms_contact_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      rms_email_notifications: {
        Row: {
          body: string
          contact_id: string | null
          created_at: string
          error_message: string | null
          has_ics_attachment: boolean | null
          ics_data: string | null
          id: string
          metadata: Json | null
          notification_type: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          trigger_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          contact_id?: string | null
          created_at?: string
          error_message?: string | null
          has_ics_attachment?: boolean | null
          ics_data?: string | null
          id?: string
          metadata?: Json | null
          notification_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          trigger_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          contact_id?: string | null
          created_at?: string
          error_message?: string | null
          has_ics_attachment?: boolean | null
          ics_data?: string | null
          id?: string
          metadata?: Json | null
          notification_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          trigger_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_email_notifications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_email_notifications_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "rms_triggers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_email_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rms_outreach: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          message: string
          priority: string | null
          scheduled_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          message: string
          priority?: string | null
          scheduled_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          message?: string
          priority?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rms_outreach_contacts: {
        Row: {
          clicked_at: string | null
          contact_id: string
          created_at: string
          id: string
          opened_at: string | null
          outreach_id: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          clicked_at?: string | null
          contact_id: string
          created_at?: string
          id?: string
          opened_at?: string | null
          outreach_id: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          clicked_at?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          opened_at?: string | null
          outreach_id?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_outreach_contacts_contact_id"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_outreach_contacts_outreach_id"
            columns: ["outreach_id"]
            isOneToOne: false
            referencedRelation: "rms_outreach"
            referencedColumns: ["id"]
          },
        ]
      }
      rms_triggers: {
        Row: {
          action: string
          calendar_event_uid: string | null
          condition: Json
          created_at: string
          description: string | null
          ics_file_url: string | null
          id: string
          is_active: boolean
          last_executed_at: string | null
          name: string
          next_execution_at: string | null
          recurrence_pattern: Json
          system_email: string | null
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          calendar_event_uid?: string | null
          condition?: Json
          created_at?: string
          description?: string | null
          ics_file_url?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name: string
          next_execution_at?: string | null
          recurrence_pattern?: Json
          system_email?: string | null
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          calendar_event_uid?: string | null
          condition?: Json
          created_at?: string
          description?: string | null
          ics_file_url?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name?: string
          next_execution_at?: string | null
          recurrence_pattern?: Json
          system_email?: string | null
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_triggers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      user_connections: {
        Row: {
          community_id: string | null
          connection_depth: number | null
          created_at: string
          id: string
          invite_id: string | null
          invitee_id: string
          inviter_id: string
          status: string | null
        }
        Insert: {
          community_id?: string | null
          connection_depth?: number | null
          created_at?: string
          id?: string
          invite_id?: string | null
          invitee_id: string
          inviter_id: string
          status?: string | null
        }
        Update: {
          community_id?: string | null
          connection_depth?: number | null
          created_at?: string
          id?: string
          invite_id?: string | null
          invitee_id?: string
          inviter_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_connections_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      assign_request_to_provider: {
        Args: { p_service_provider_id: string; p_service_request_id: string }
        Returns: boolean
      }
      can_view_profile: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: boolean
      }
      create_community: {
        Args: {
          p_communication_platforms?: Json
          p_description: string
          p_format?: string
          p_is_public?: boolean
          p_location?: string
          p_name: string
          p_social_media?: Json
          p_tags?: string[]
          p_target_audience?: Json
          p_type?: string
          p_website?: string
        }
        Returns: string
      }
      generate_unique_invite_code: { Args: never; Returns: string }
      get_community_events: {
        Args: { community_id: string }
        Returns: {
          attendee_count: number
          description: string
          event_date: string
          id: string
          location: string
          max_attendees: number
          registration_required: boolean
          title: string
        }[]
      }
      get_community_member_count: {
        Args: { community_id: string }
        Returns: number
      }
      get_connected_profiles: {
        Args: { user_id: string }
        Returns: {
          avatar_url: string
          full_name: string
          profile_id: string
          user_id: string
        }[]
      }
      get_connection_depth: {
        Args: { user_a: string; user_b: string }
        Returns: number
      }
      get_highest_role: { Args: { user_id: string }; Returns: string }
      get_knowledge_articles: {
        Args: {
          p_content_type?: string
          p_limit?: number
          p_offset?: number
          p_search_query?: string
          p_sort_by?: string
          p_tag?: string
          p_user_id?: string
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          comment_count: number
          content: string
          content_type: string
          created_at: string
          id: string
          is_answered: boolean
          is_featured: boolean
          is_published: boolean
          subtitle: string
          tags: string[]
          title: string
          updated_at: string
          user_vote: string
          view_count: number
          vote_count: number
        }[]
      }
      get_lexicon_analytics: {
        Args: { p_days_back?: number; p_term_type?: string }
        Returns: {
          first_used_at: string
          first_user_name: string
          recent_usage: number
          term: string
          term_type: string
          total_usage: number
          unique_users: number
        }[]
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
      get_or_create_iotas: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          cultiv8_posts: number
          eco8_communities: number
          id: string
          rel8_contacts: number
          total_network_value: number | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "iotas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_poll_counts: {
        Args: { poll_id: string }
        Returns: {
          count: number
          option_index: number
        }[]
      }
      get_rel8t_metrics: { Args: never; Returns: Json }
      get_term_suggestions: {
        Args: { p_limit?: number; p_search_query?: string; p_term_type: string }
        Returns: {
          first_user_name: string
          id: string
          term: string
          usage_count: number
        }[]
      }
      get_user_community_ids: { Args: { user_uuid: string }; Returns: string[] }
      get_user_memberships: {
        Args: { user_id: string }
        Returns: {
          community_id: string
          community_name: string
          role: string
          status: string
        }[]
      }
      get_user_owned_communities: {
        Args: { user_id: string }
        Returns: {
          community_id: string
          community_name: string
          member_count: number
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
      increment_iota_metric: {
        Args: { p_increment?: number; p_metric_type: string; p_user_id: string }
        Returns: boolean
      }
      increment_view_count: { Args: { article_id: string }; Returns: undefined }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_community_owner: {
        Args: { community_id: string; user_id: string }
        Returns: boolean
      }
      log_audit_action: {
        Args: { action_details?: Json; action_name: string; user_id?: string }
        Returns: string
      }
      populate_us_states_from_atlas: { Args: never; Returns: number }
      record_invite_use: {
        Args: { invite_code: string; used_by_id: string }
        Returns: boolean
      }
      register_for_event: { Args: { event_id: string }; Returns: boolean }
      search_locations: {
        Args: {
          limit_count?: number
          location_type?: string
          search_query: string
        }
        Returns: {
          country_code: string
          formatted_address: string
          id: string
          name: string
          parent_name: string
          state_code: string
          type: string
        }[]
      }
      sync_existing_data_to_lexicon: { Args: never; Returns: number }
      track_location_usage: {
        Args: {
          location_name: string
          source_record_id: string
          source_table: string
          user_id: string
        }
        Returns: string
      }
      update_article_vote_count: {
        Args: { article_uuid: string }
        Returns: undefined
      }
      update_comment_vote_count: {
        Args: { comment_uuid: string }
        Returns: number
      }
      update_lexicon_usage: {
        Args: {
          p_source_field: string
          p_source_record_id: string
          p_source_table: string
          p_term: string
          p_term_type: string
          p_user_id?: string
        }
        Returns: string
      }
      update_module_completion: {
        Args: { is_complete?: boolean; module_name: string; user_id: string }
        Returns: boolean
      }
      update_network_value: { Args: { p_user_id: string }; Returns: undefined }
      update_user_role: {
        Args: { p_assigner_id?: string; p_role_name: string; p_user_id: string }
        Returns: boolean
      }
      update_user_role_self: { Args: { p_role_name: string }; Returns: boolean }
      use_invite_link: {
        Args: {
          p_invite_code: string
          p_visitor_email: string
          p_visitor_name: string
          p_visitor_phone?: string
          p_visitor_tags?: string[]
        }
        Returns: string
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
