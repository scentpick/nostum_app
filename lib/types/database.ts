// 데이터베이스 테이블 타입 정의
// Supabase에서 자동 생성되는 타입을 기반으로 정의

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_url: string | null;
          google_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          avatar_url?: string | null;
          google_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          avatar_url?: string | null;
          google_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name_kr: string;
          name_en: string;
          nickname: string | null;
          description: string | null;
          logo_url: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_kr: string;
          name_en: string;
          nickname?: string | null;
          description?: string | null;
          logo_url?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_kr?: string;
          name_en?: string;
          nickname?: string | null;
          description?: string | null;
          logo_url?: string | null;
          country?: string | null;
          created_at?: string;
        };
      };
      perfumes: {
        Row: {
          id: string;
          brand_id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          price: number | null;
          volume_ml: number | null;
          gender: 'male' | 'female' | 'unisex' | null;
          release_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          price?: number | null;
          volume_ml?: number | null;
          gender?: 'male' | 'female' | 'unisex' | null;
          release_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          price?: number | null;
          volume_ml?: number | null;
          gender?: 'male' | 'female' | 'unisex' | null;
          release_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fragrant_wheels: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          color_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          color_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          color_code?: string | null;
          created_at?: string;
        };
      };
      perfume_fragrant_wheels: {
        Row: {
          id: string;
          perfume_id: string;
          fragrant_wheel_id: string;
          intensity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          perfume_id: string;
          fragrant_wheel_id: string;
          intensity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          perfume_id?: string;
          fragrant_wheel_id?: string;
          intensity?: number;
          created_at?: string;
        };
      };
      perfume_notes: {
        Row: {
          id: string;
          perfume_id: string;
          note_name: string;
          note_type: 'top' | 'middle' | 'base';
          created_at: string;
        };
        Insert: {
          id?: string;
          perfume_id: string;
          note_name: string;
          note_type: 'top' | 'middle' | 'base';
          created_at?: string;
        };
        Update: {
          id?: string;
          perfume_id?: string;
          note_name?: string;
          note_type?: 'top' | 'middle' | 'base';
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      perfume_tags: {
        Row: {
          id: string;
          perfume_id: string;
          tag_id: string;
        };
        Insert: {
          id?: string;
          perfume_id: string;
          tag_id: string;
        };
        Update: {
          id?: string;
          perfume_id?: string;
          tag_id?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          perfume_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          longevity_rating: number | null;
          sillage_rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          perfume_id: string;
          rating: number;
          title?: string | null;
          content?: string | null;
          longevity_rating?: number | null;
          sillage_rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          perfume_id?: string;
          rating?: number;
          title?: string | null;
          content?: string | null;
          longevity_rating?: number | null;
          sillage_rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          perfume_id: string;
          favorite_type: 'owned' | 'tried' | 'want_to_buy';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          perfume_id: string;
          favorite_type: 'owned' | 'tried' | 'want_to_buy';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          perfume_id?: string;
          favorite_type?: 'owned' | 'tried' | 'want_to_buy';
          created_at?: string;
        };
      };
      board_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          title: string;
          content: string;
          image_urls: string[] | null;
          view_count: number;
          like_count: number;
          comment_count: number;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          title: string;
          content: string;
          image_urls?: string[] | null;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          title?: string;
          content?: string;
          image_urls?: string[] | null;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          parent_id?: string | null;
          content?: string;
          like_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      chatbot_conversations: {
        Row: {
          id: string;
          user_id: string;
          chatbot_type: 'tommy' | 'nora' | 'scentie';
          message: string;
          is_user_message: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chatbot_type: 'tommy' | 'nora' | 'scentie';
          message: string;
          is_user_message: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chatbot_type?: 'tommy' | 'nora' | 'scentie';
          message?: string;
          is_user_message?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}