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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      biometrics: {
        Row: {
          biomassa_estimada: number | null
          created_at: string
          cycle_id: string
          data_coleta: string
          id: string
          observacoes: string | null
          peso_medio_amostra: number
          quantidade_amostra: number | null
          user_id: string
        }
        Insert: {
          biomassa_estimada?: number | null
          created_at?: string
          cycle_id: string
          data_coleta: string
          id?: string
          observacoes?: string | null
          peso_medio_amostra: number
          quantidade_amostra?: number | null
          user_id: string
        }
        Update: {
          biomassa_estimada?: number | null
          created_at?: string
          cycle_id?: string
          data_coleta?: string
          id?: string
          observacoes?: string | null
          peso_medio_amostra?: number
          quantidade_amostra?: number | null
          user_id?: string
        }
        Relationships: []
      }
      cultivation_cycles: {
        Row: {
          biomassa_inicial: number | null
          created_at: string
          data_despesca: string | null
          data_fim: string | null
          data_inicio: string
          data_povoamento: string
          fca_final: number | null
          id: string
          nome_ciclo: string
          observacoes: string | null
          peso_final_despesca: number | null
          peso_inicial_total: number | null
          pond_id: string
          preco_venda_kg: number | null
          receita_total: number | null
          sobrevivencia_final: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          biomassa_inicial?: number | null
          created_at?: string
          data_despesca?: string | null
          data_fim?: string | null
          data_inicio?: string
          data_povoamento: string
          fca_final?: number | null
          id?: string
          nome_ciclo: string
          observacoes?: string | null
          peso_final_despesca?: number | null
          peso_inicial_total?: number | null
          pond_id: string
          preco_venda_kg?: number | null
          receita_total?: number | null
          sobrevivencia_final?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          biomassa_inicial?: number | null
          created_at?: string
          data_despesca?: string | null
          data_fim?: string | null
          data_inicio?: string
          data_povoamento?: string
          fca_final?: number | null
          id?: string
          nome_ciclo?: string
          observacoes?: string | null
          peso_final_despesca?: number | null
          peso_inicial_total?: number | null
          pond_id?: string
          preco_venda_kg?: number | null
          receita_total?: number | null
          sobrevivencia_final?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_feeding: {
        Row: {
          created_at: string
          cycle_id: string
          data_alimentacao: string
          fornecedor: string | null
          id: string
          lote_racao: string | null
          mortalidade_observada: number | null
          observacoes: string | null
          quantidade_racao: number
          tipo_racao: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          data_alimentacao: string
          fornecedor?: string | null
          id?: string
          lote_racao?: string | null
          mortalidade_observada?: number | null
          observacoes?: string | null
          quantidade_racao: number
          tipo_racao?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          data_alimentacao?: string
          fornecedor?: string | null
          id?: string
          lote_racao?: string | null
          mortalidade_observada?: number | null
          observacoes?: string | null
          quantidade_racao?: number
          tipo_racao?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedings: {
        Row: {
          date: string | null
          fed_at: string | null
          feed_quantity: number | null
          feed_type: string | null
          id: string
          mortality: number | null
          pond_id: string | null
          pond_name: string | null
          quantity: number | null
          updated_at: string | null
          user_id: string
          water_quality: string | null
        }
        Insert: {
          date?: string | null
          fed_at?: string | null
          feed_quantity?: number | null
          feed_type?: string | null
          id?: string
          mortality?: number | null
          pond_id?: string | null
          pond_name?: string | null
          quantity?: number | null
          updated_at?: string | null
          user_id: string
          water_quality?: string | null
        }
        Update: {
          date?: string | null
          fed_at?: string | null
          feed_quantity?: number | null
          feed_type?: string | null
          id?: string
          mortality?: number | null
          pond_id?: string | null
          pond_name?: string | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string
          water_quality?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedings_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          categoria: string
          criado_em: string
          data: string
          descricao: string | null
          id: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          criado_em?: string
          data: string
          descricao?: string | null
          id?: string
          tipo: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          criado_em?: string
          data?: string
          descricao?: string | null
          id?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          contato: string | null
          created_at: string
          data_admissao: string
          funcao_cargo: string
          id: string
          nome_completo: string
          observacoes: string | null
          salario_mensal: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contato?: string | null
          created_at?: string
          data_admissao: string
          funcao_cargo: string
          id?: string
          nome_completo: string
          observacoes?: string | null
          salario_mensal: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contato?: string | null
          created_at?: string
          data_admissao?: string
          funcao_cargo?: string
          id?: string
          nome_completo?: string
          observacoes?: string | null
          salario_mensal?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          ciclo_id: string
          created_at: string
          data: string
          diagnostico: string | null
          id: string
          sintomas: string | null
          tratamento: string | null
          user_id: string
        }
        Insert: {
          ciclo_id: string
          created_at?: string
          data: string
          diagnostico?: string | null
          id?: string
          sintomas?: string | null
          tratamento?: string | null
          user_id: string
        }
        Update: {
          ciclo_id?: string
          created_at?: string
          data?: string
          diagnostico?: string | null
          id?: string
          sintomas?: string | null
          tratamento?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "cultivation_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          quantity: number | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          quantity?: number | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          quantity?: number | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ponds: {
        Row: {
          created_at: string | null
          farm_id: string | null
          id: string
          name: string
          size: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          farm_id?: string | null
          id?: string
          name: string
          size?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          farm_id?: string | null
          id?: string
          name?: string
          size?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ponds_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "shrimp_farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ponds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      shrimp_farms: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shrimp_farms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          ciclo_id: string | null
          created_at: string
          data_limite: string | null
          descricao: string | null
          id: string
          responsavel_id: string | null
          status: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ciclo_id?: string | null
          created_at?: string
          data_limite?: string | null
          descricao?: string | null
          id?: string
          responsavel_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ciclo_id?: string | null
          created_at?: string
          data_limite?: string | null
          descricao?: string | null
          id?: string
          responsavel_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "cultivation_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      water_quality: {
        Row: {
          alcalinidade: number | null
          cor_agua: string | null
          created_at: string
          cycle_id: string
          data_coleta: string
          id: string
          observacoes: string | null
          oxigenio_dissolvido: number | null
          ph: number | null
          salinidade: number | null
          temperatura: number | null
          turbidez: number | null
          user_id: string
        }
        Insert: {
          alcalinidade?: number | null
          cor_agua?: string | null
          created_at?: string
          cycle_id: string
          data_coleta?: string
          id?: string
          observacoes?: string | null
          oxigenio_dissolvido?: number | null
          ph?: number | null
          salinidade?: number | null
          temperatura?: number | null
          turbidez?: number | null
          user_id: string
        }
        Update: {
          alcalinidade?: number | null
          cor_agua?: string | null
          created_at?: string
          cycle_id?: string
          data_coleta?: string
          id?: string
          observacoes?: string | null
          oxigenio_dissolvido?: number | null
          ph?: number | null
          salinidade?: number | null
          temperatura?: number | null
          turbidez?: number | null
          user_id?: string
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
