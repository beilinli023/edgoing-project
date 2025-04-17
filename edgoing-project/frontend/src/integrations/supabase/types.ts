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
      grade_levels: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_zh: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_zh: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_zh?: string
        }
        Relationships: []
      }
      program_grade_levels: {
        Row: {
          grade_id: string
          program_id: string
        }
        Insert: {
          grade_id: string
          program_id: string
        }
        Update: {
          grade_id?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_grade_levels_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grade_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_grade_levels_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_tags: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_zh: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_zh: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_zh?: string
        }
        Relationships: []
      }
      program_tags_programs: {
        Row: {
          program_id: string
          tag_id: string
        }
        Insert: {
          program_id: string
          tag_id: string
        }
        Update: {
          program_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_tags_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_tags_programs_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "program_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_zh: string | null
          duration_en: string | null
          duration_zh: string | null
          gallery: string[] | null
          id: string
          instructor_en: string | null
          instructor_zh: string | null
          is_featured: boolean | null
          is_popular: boolean | null
          learning_outcomes_en: string | null
          learning_outcomes_zh: string | null
          location_en: string | null
          location_zh: string | null
          order_index: number | null
          price: number | null
          program_id: string
          requirements_en: string | null
          requirements_zh: string | null
          summary_en: string | null
          summary_zh: string | null
          thumbnail: string | null
          title_en: string
          title_zh: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_zh?: string | null
          duration_en?: string | null
          duration_zh?: string | null
          gallery?: string[] | null
          id?: string
          instructor_en?: string | null
          instructor_zh?: string | null
          is_featured?: boolean | null
          is_popular?: boolean | null
          learning_outcomes_en?: string | null
          learning_outcomes_zh?: string | null
          location_en?: string | null
          location_zh?: string | null
          order_index?: number | null
          price?: number | null
          program_id: string
          requirements_en?: string | null
          requirements_zh?: string | null
          summary_en?: string | null
          summary_zh?: string | null
          thumbnail?: string | null
          title_en: string
          title_zh: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_zh?: string | null
          duration_en?: string | null
          duration_zh?: string | null
          gallery?: string[] | null
          id?: string
          instructor_en?: string | null
          instructor_zh?: string | null
          is_featured?: boolean | null
          is_popular?: boolean | null
          learning_outcomes_en?: string | null
          learning_outcomes_zh?: string | null
          location_en?: string | null
          location_zh?: string | null
          order_index?: number | null
          price?: number | null
          program_id?: string
          requirements_en?: string | null
          requirements_zh?: string | null
          summary_en?: string | null
          summary_zh?: string | null
          thumbnail?: string | null
          title_en?: string
          title_zh?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
