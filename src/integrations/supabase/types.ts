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
      knowledge_articles: {
        Row: {
          author_id: string
          category: string | null
          community_id: string | null
          content: string
          content_type: string | null
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
          community_id?: string | null
          content: string
          content_type?: string | null
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
          community_id?: string | null
          content?: string
          content_type?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
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
          updated_at: string
        }
        Insert: {
          article_id: string
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_accepted_answer?: boolean | null
          updated_at?: string
        }
        Update: {
          article_id?: string
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_accepted_answer?: boolean | null
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
          focus_areas: string[] | null
          id: string
          industry: string | null
          organization_name: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          budget_range?: string | null
          company_size?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          industry?: string | null
          organization_name?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          budget_range?: string | null
          company_size?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          industry?: string | null
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
      modul8_proposal_cards: {
        Row: {
          created_at: string
          deel_contract_url: string | null
          description: string | null
          id: string
          proposed_budget: number | null
          proposed_timeline: string | null
          provider_id: string
          request_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deel_contract_url?: string | null
          description?: string | null
          id?: string
          proposed_budget?: number | null
          proposed_timeline?: string | null
          provider_id: string
          request_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deel_contract_url?: string | null
          description?: string | null
          id?: string
          proposed_budget?: number | null
          proposed_timeline?: string | null
          provider_id?: string
          request_id?: string
          status?: string
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
      modul8_service_providers: {
        Row: {
          availability_status: string | null
          business_name: string | null
          created_at: string
          description: string | null
          id: string
          portfolio_links: string[] | null
          pricing_model: string | null
          rating: number | null
          services_offered: string[] | null
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
          id?: string
          portfolio_links?: string[] | null
          pricing_model?: string | null
          rating?: number | null
          services_offered?: string[] | null
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
          id?: string
          portfolio_links?: string[] | null
          pricing_model?: string | null
          rating?: number | null
          services_offered?: string[] | null
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
          is_profile_complete: boolean | null
          labr8_complete: boolean | null
          labr8_setup_complete: boolean | null
          last_login_at: string | null
          last_name: string | null
          location: string | null
          managed_communities: string[] | null
          modul8_complete: boolean | null
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
          eco8_complete?: boolean | null
          eco8_setup_complete?: boolean | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_profile_complete?: boolean | null
          labr8_complete?: boolean | null
          labr8_setup_complete?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          managed_communities?: string[] | null
          modul8_complete?: boolean | null
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
          eco8_complete?: boolean | null
          eco8_setup_complete?: boolean | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_profile_complete?: boolean | null
          labr8_complete?: boolean | null
          labr8_setup_complete?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          managed_communities?: string[] | null
          modul8_complete?: boolean | null
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
          category_id: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          source: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          source?: string | null
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
          id: string
          metadata: Json | null
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
          id?: string
          metadata?: Json | null
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
          id?: string
          metadata?: Json | null
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
          id: string
          message: string
          scheduled_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          scheduled_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
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
        Relationships: []
      }
      rms_triggers: {
        Row: {
          action: string
          condition: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          last_executed_at: string | null
          name: string
          next_execution_at: string | null
          recurrence_pattern: Json
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          condition?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name: string
          next_execution_at?: string | null
          recurrence_pattern?: Json
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          condition?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name?: string
          next_execution_at?: string | null
          recurrence_pattern?: Json
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
      generate_unique_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      get_rel8t_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
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
      increment_view_count: {
        Args: { article_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_community_owner: {
        Args: { community_id: string; user_id: string }
        Returns: boolean
      }
      log_audit_action: {
        Args: { action_details?: Json; action_name: string; user_id?: string }
        Returns: string
      }
      record_invite_use: {
        Args: { invite_code: string; used_by_id: string }
        Returns: boolean
      }
      register_for_event: {
        Args: { event_id: string }
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
      update_user_role_self: {
        Args: { p_role_name: string }
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
