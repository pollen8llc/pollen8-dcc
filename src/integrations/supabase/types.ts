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
          communication_platforms: Json | null
          community_size: string | null
          community_structure: string | null
          community_type: string | null
          community_values: string | null
          created_at: string
          description: string
          event_frequency: string | null
          format: string | null
          founder_name: string | null
          id: string
          is_public: boolean
          location: string | null
          logo_url: string | null
          member_count: string | null
          name: string
          newsletter_url: string | null
          owner_id: string | null
          personal_background: string | null
          role_title: string | null
          social_media: Json | null
          start_date: string | null
          tags: string[] | null
          target_audience: string[] | null
          type: string | null
          updated_at: string
          vision: string | null
          website: string | null
        }
        Insert: {
          communication_platforms?: Json | null
          community_size?: string | null
          community_structure?: string | null
          community_type?: string | null
          community_values?: string | null
          created_at?: string
          description?: string
          event_frequency?: string | null
          format?: string | null
          founder_name?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          logo_url?: string | null
          member_count?: string | null
          name: string
          newsletter_url?: string | null
          owner_id?: string | null
          personal_background?: string | null
          role_title?: string | null
          social_media?: Json | null
          start_date?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          type?: string | null
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Update: {
          communication_platforms?: Json | null
          community_size?: string | null
          community_structure?: string | null
          community_type?: string | null
          community_values?: string | null
          created_at?: string
          description?: string
          event_frequency?: string | null
          format?: string | null
          founder_name?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          logo_url?: string | null
          member_count?: string | null
          name?: string
          newsletter_url?: string | null
          owner_id?: string | null
          personal_background?: string | null
          role_title?: string | null
          social_media?: Json | null
          start_date?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          type?: string | null
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
        Relationships: []
      }
      invites: {
        Row: {
          code: string
          community_id: string | null
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
          community_id?: string | null
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
          community_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "invites_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_articles: {
        Row: {
          allow_multiple_responses: boolean | null
          archived_at: string | null
          archived_by: string | null
          comment_count: number
          content: string
          content_type: string | null
          created_at: string
          id: string
          is_answered: boolean | null
          options: Json | null
          poll_data: Json | null
          poll_expires_at: string | null
          source: string | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
          vote_count: number
        }
        Insert: {
          allow_multiple_responses?: boolean | null
          archived_at?: string | null
          archived_by?: string | null
          comment_count?: number
          content: string
          content_type?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          options?: Json | null
          poll_data?: Json | null
          poll_expires_at?: string | null
          source?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
          vote_count?: number
        }
        Update: {
          allow_multiple_responses?: boolean | null
          archived_at?: string | null
          archived_by?: string | null
          comment_count?: number
          content?: string
          content_type?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          options?: Json | null
          poll_data?: Json | null
          poll_expires_at?: string | null
          source?: string | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_knowledge_articles_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          is_accepted: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          is_accepted?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          is_accepted?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
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
        ]
      }
      knowledge_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
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
          vote_type: number
        }
        Insert: {
          article_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id: string
          vote_type: number
        }
        Update: {
          article_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: number
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
        ]
      }
      modul8_deals: {
        Row: {
          completed_at: string | null
          created_at: string
          deal_terms: Json
          deel_contract_url: string | null
          final_amount: number
          id: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deal_terms: Json
          deel_contract_url?: string | null
          final_amount: number
          id?: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deal_terms?: Json
          deel_contract_url?: string | null
          final_amount?: number
          id?: string
          organizer_id?: string
          service_provider_id?: string
          service_request_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modul8_deals_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "modul8_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_deals_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_deals_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_engagements: {
        Row: {
          created_at: string
          engagement_type: string
          id: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string | null
        }
        Insert: {
          created_at?: string
          engagement_type: string
          id?: string
          organizer_id: string
          service_provider_id: string
          service_request_id?: string | null
        }
        Update: {
          created_at?: string
          engagement_type?: string
          id?: string
          organizer_id?: string
          service_provider_id?: string
          service_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modul8_engagements_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "modul8_organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_engagements_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_engagements_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      modul8_organizers: {
        Row: {
          created_at: string
          description: string | null
          focus_areas: string[] | null
          id: string
          logo_url: string | null
          organization_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          logo_url?: string | null
          organization_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          logo_url?: string | null
          organization_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modul8_project_comments: {
        Row: {
          attachments: Json | null
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
          attachments?: Json | null
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
          attachments?: Json | null
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
          completion_notes: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          deliverables: Json | null
          id: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status: string
          submitted_at: string
        }
        Insert: {
          completion_notes?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          deliverables?: Json | null
          id?: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status?: string
          submitted_at?: string
        }
        Update: {
          completion_notes?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          deliverables?: Json | null
          id?: string
          organizer_id?: string
          service_provider_id?: string
          service_request_id?: string
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_project_completions_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          order_index: number | null
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
          order_index?: number | null
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
          order_index?: number | null
          service_request_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_project_milestones_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_project_ratings: {
        Row: {
          completion_id: string
          created_at: string
          feedback: string | null
          id: string
          organizer_id: string
          rating: number
          service_provider_id: string
          service_request_id: string
        }
        Insert: {
          completion_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          organizer_id: string
          rating: number
          service_provider_id: string
          service_request_id: string
        }
        Update: {
          completion_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          organizer_id?: string
          rating?: number
          service_provider_id?: string
          service_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_project_ratings_completion_id_fkey"
            columns: ["completion_id"]
            isOneToOne: false
            referencedRelation: "modul8_project_completions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modul8_project_ratings_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_project_revisions: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string
          id: string
          organizer_id: string
          revision_type: string
          service_provider_id: string
          service_request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description: string
          id?: string
          organizer_id: string
          revision_type: string
          service_provider_id: string
          service_request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string
          id?: string
          organizer_id?: string
          revision_type?: string
          service_provider_id?: string
          service_request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modul8_project_revisions_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_proposal_threads: {
        Row: {
          created_at: string
          id: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organizer_id: string
          service_provider_id: string
          service_request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organizer_id?: string
          service_provider_id?: string
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
          created_at: string
          created_by: string
          id: string
          proposal_id: string
          quote_amount: number | null
          scope_details: string | null
          terms: string | null
          thread_id: string
          timeline: string | null
          version_number: number
        }
        Insert: {
          change_notes?: string | null
          created_at?: string
          created_by: string
          id?: string
          proposal_id: string
          quote_amount?: number | null
          scope_details?: string | null
          terms?: string | null
          thread_id: string
          timeline?: string | null
          version_number?: number
        }
        Update: {
          change_notes?: string | null
          created_at?: string
          created_by?: string
          id?: string
          proposal_id?: string
          quote_amount?: number | null
          scope_details?: string | null
          terms?: string | null
          thread_id?: string
          timeline?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "modul8_proposal_versions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "modul8_proposals"
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
          from_user_id: string
          id: string
          proposal_type: string
          quote_amount: number | null
          scope_details: string | null
          service_request_id: string
          status: string | null
          terms: string | null
          timeline: string | null
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          proposal_type: string
          quote_amount?: number | null
          scope_details?: string | null
          service_request_id: string
          status?: string | null
          terms?: string | null
          timeline?: string | null
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          proposal_type?: string
          quote_amount?: number | null
          scope_details?: string | null
          service_request_id?: string
          status?: string | null
          terms?: string | null
          timeline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modul8_proposals_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "modul8_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      modul8_service_providers: {
        Row: {
          business_name: string
          created_at: string
          description: string | null
          domain_specializations: number[] | null
          id: string
          logo_url: string | null
          portfolio_links: string[] | null
          pricing_range: Json | null
          services: Json | null
          tagline: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          created_at?: string
          description?: string | null
          domain_specializations?: number[] | null
          id?: string
          logo_url?: string | null
          portfolio_links?: string[] | null
          pricing_range?: Json | null
          services?: Json | null
          tagline?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          created_at?: string
          description?: string | null
          domain_specializations?: number[] | null
          id?: string
          logo_url?: string | null
          portfolio_links?: string[] | null
          pricing_range?: Json | null
          services?: Json | null
          tagline?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modul8_service_requests: {
        Row: {
          budget_range: Json | null
          created_at: string
          description: string | null
          domain_page: number
          engagement_status: string | null
          id: string
          milestones: Json | null
          organizer_id: string
          project_progress: number | null
          service_provider_id: string | null
          status: string | null
          timeline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_range?: Json | null
          created_at?: string
          description?: string | null
          domain_page: number
          engagement_status?: string | null
          id?: string
          milestones?: Json | null
          organizer_id: string
          project_progress?: number | null
          service_provider_id?: string | null
          status?: string | null
          timeline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_range?: Json | null
          created_at?: string
          description?: string | null
          domain_page?: number
          engagement_status?: string | null
          id?: string
          milestones?: Json | null
          organizer_id?: string
          project_progress?: number | null
          service_provider_id?: string | null
          status?: string | null
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
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
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
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          interests: string[] | null
          invited_by: string | null
          last_name: string | null
          location: string | null
          privacy_settings: Json
          profile_complete: boolean | null
          social_links: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          interests?: string[] | null
          invited_by?: string | null
          last_name?: string | null
          location?: string | null
          privacy_settings?: Json
          profile_complete?: boolean | null
          social_links?: Json | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          interests?: string[] | null
          invited_by?: string | null
          last_name?: string | null
          location?: string | null
          privacy_settings?: Json
          profile_complete?: boolean | null
          social_links?: Json | null
          updated_at?: string
          user_id?: string
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
          created_at: string | null
          id: string
          relationship: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affiliated_community_id?: string | null
          affiliated_contact_id?: string | null
          affiliated_user_id?: string | null
          affiliation_type: string
          contact_id: string
          created_at?: string | null
          id?: string
          relationship?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affiliated_community_id?: string | null
          affiliated_contact_id?: string | null
          affiliated_user_id?: string | null
          affiliation_type?: string
          contact_id?: string
          created_at?: string | null
          id?: string
          relationship?: string | null
          updated_at?: string | null
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
            foreignKeyName: "rms_contact_affiliations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      rms_contact_categories: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_system_protected: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_system_protected?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_system_protected?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rms_contact_group_members: {
        Row: {
          added_at: string | null
          contact_id: string
          group_id: string
          id: string
        }
        Insert: {
          added_at?: string | null
          contact_id: string
          group_id: string
          id?: string
        }
        Update: {
          added_at?: string | null
          contact_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
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
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rms_contacts: {
        Row: {
          category_id: string | null
          created_at: string | null
          email: string | null
          id: string
          last_contact_date: string | null
          location: string | null
          name: string
          notes: string | null
          organization: string | null
          phone: string | null
          role: string | null
          source: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          location?: string | null
          name: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          location?: string | null
          name?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
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
          created_at: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string
          trigger_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          trigger_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          trigger_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rms_email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rms_outreach: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority: string
          status: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rms_outreach_contacts: {
        Row: {
          contact_id: string
          id: string
          outreach_id: string
        }
        Insert: {
          contact_id: string
          id?: string
          outreach_id: string
        }
        Update: {
          contact_id?: string
          id?: string
          outreach_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rms_outreach_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "rms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rms_outreach_contacts_outreach_id_fkey"
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
          condition: string
          created_at: string | null
          description: string | null
          execution_time: string | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          next_execution: string | null
          recurrence_pattern: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action: string
          condition: string
          created_at?: string | null
          description?: string | null
          execution_time?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          next_execution?: string | null
          recurrence_pattern?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          execution_time?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          next_execution?: string | null
          recurrence_pattern?: Json | null
          updated_at?: string | null
          user_id?: string
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
      submission_errors: {
        Row: {
          created_at: string | null
          distribution_id: string | null
          error_details: Json | null
          error_message: string
          error_type: string
          id: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          created_at?: string | null
          distribution_id?: string | null
          error_details?: Json | null
          error_message: string
          error_type: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          created_at?: string | null
          distribution_id?: string | null
          error_details?: Json | null
          error_message?: string
          error_type?: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_errors_distribution_id_fkey"
            columns: ["distribution_id"]
            isOneToOne: false
            referencedRelation: "community_data_distribution"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          community_id: string | null
          connected_at: string
          connection_depth: number
          id: string
          invite_id: string | null
          invitee_id: string
          inviter_id: string
        }
        Insert: {
          community_id?: string | null
          connected_at?: string
          connection_depth?: number
          id?: string
          invite_id?: string | null
          invitee_id: string
          inviter_id: string
        }
        Update: {
          community_id?: string | null
          connected_at?: string
          connection_depth?: number
          id?: string
          invite_id?: string | null
          invitee_id?: string
          inviter_id?: string
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
            foreignKeyName: "user_connections_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
      users: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_profile: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      can_manage_community: {
        Args: { user_id: string; community_id: string }
        Returns: boolean
      }
      can_view_profile: {
        Args: { viewer_id: string; profile_id: string }
        Returns: boolean
      }
      generate_unique_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_article_vote_count: {
        Args: { article_id: string }
        Returns: number
      }
      get_comment_vote_count: {
        Args: { comment_id: string }
        Returns: number
      }
      get_community_admin_status: {
        Args: { user_id: string; community_id: string }
        Returns: boolean
      }
      get_connected_profiles: {
        Args: { user_id: string; max_depth?: number }
        Returns: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          interests: string[] | null
          invited_by: string | null
          last_name: string | null
          location: string | null
          privacy_settings: Json
          profile_complete: boolean | null
          social_links: Json | null
          updated_at: string
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
      get_is_admin: {
        Args: { user_id: string }
        Returns: boolean
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
      increment_view_count: {
        Args: { article_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_or_self: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_community_owner: {
        Args: { user_id: string; community_id: string }
        Returns: boolean
      }
      is_connected_within_depth: {
        Args: { viewer_id: string; profile_id: string; max_depth?: number }
        Returns: boolean
      }
      log_audit_action: {
        Args: {
          action_name: string
          performer_id?: string
          target_id?: string
          action_details?: Json
        }
        Returns: undefined
      }
      record_invite_use: {
        Args: { invite_code: string; user_id: string }
        Returns: string
      }
      safe_delete_community: {
        Args: { community_id: string; user_id: string }
        Returns: boolean
      }
      update_user_role: {
        Args: { p_user_id: string; p_role_name: string; p_assigner_id: string }
        Returns: boolean
      }
      update_user_role_self: {
        Args: { new_role: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "ADMIN" | "ORGANIZER" | "MEMBER" | "SERVICE_PROVIDER"
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
      app_role: ["ADMIN", "ORGANIZER", "MEMBER", "SERVICE_PROVIDER"],
    },
  },
} as const
