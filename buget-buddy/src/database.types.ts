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
      account_types: {
        Row: {
          display_name: string
          id: string
        }
        Insert: {
          display_name: string
          id?: string
        }
        Update: {
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          account_type_id: string
          balance: number
          bank_name: string | null
          created_at: string
          currency_id: string
          display_name: string
          id: string
          user_id: string
        }
        Insert: {
          account_type_id: string
          balance: number
          bank_name?: string | null
          created_at?: string
          currency_id: string
          display_name: string
          id?: string
          user_id: string
        }
        Update: {
          account_type_id?: string
          balance?: number
          bank_name?: string | null
          created_at?: string
          currency_id?: string
          display_name?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_account_type_id_fkey"
            columns: ["account_type_id"]
            isOneToOne: false
            referencedRelation: "account_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          display_name: string
          id: string
          transaction_type: string
        }
        Insert: {
          display_name: string
          id?: string
          transaction_type: string
        }
        Update: {
          display_name?: string
          id?: string
          transaction_type?: string
        }
        Relationships: []
      }
      currencies: {
        Row: {
          display_name: string
          id: string
        }
        Insert: {
          display_name: string
          id?: string
        }
        Update: {
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      deposit_transactions: {
        Row: {
          account_to: string
          amount: number
          id: string
          transaction_id: string
        }
        Insert: {
          account_to: string
          amount: number
          id?: string
          transaction_id: string
        }
        Update: {
          account_to?: string
          amount?: number
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposit_transactions_account_to_fkey"
            columns: ["account_to"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposit_transactions_account_to_fkey1"
            columns: ["account_to"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposit_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          created_at: string
          currency_from: string
          currency_to: string
          date: string
          id: string
          rate: number
        }
        Insert: {
          created_at?: string
          currency_from: string
          currency_to: string
          date: string
          id?: string
          rate: number
        }
        Update: {
          created_at?: string
          currency_from?: string
          currency_to?: string
          date?: string
          id?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "exchange_rates_currency_from_fkey"
            columns: ["currency_from"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_rates_currency_to_fkey"
            columns: ["currency_to"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_transactions: {
        Row: {
          account_from: string
          account_to: string
          amount_from: number
          amount_to: number
          id: string
          transaction_id_from: string
          transaction_id_to: string
        }
        Insert: {
          account_from: string
          account_to: string
          amount_from: number
          amount_to: number
          id?: string
          transaction_id_from: string
          transaction_id_to: string
        }
        Update: {
          account_from?: string
          account_to?: string
          amount_from?: number
          amount_to?: number
          id?: string
          transaction_id_from?: string
          transaction_id_to?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_transactions_account_from_fkey"
            columns: ["account_from"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_transactions_account_to_fkey"
            columns: ["account_to"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_transactions_transaction_id_from_fkey"
            columns: ["transaction_id_from"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_transactions_transaction_id_to_fkey"
            columns: ["transaction_id_to"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_transactions_exist: {
        Row: {
          created_at: string
          currency_from: string
          currency_to: string
          date: string
          id: string
        }
        Insert: {
          created_at?: string
          currency_from: string
          currency_to: string
          date: string
          id?: string
        }
        Update: {
          created_at?: string
          currency_from?: string
          currency_to?: string
          date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_transactions_exist_from_currency_fkey"
            columns: ["currency_from"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_transactions_exist_to_currency_fkey"
            columns: ["currency_to"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_transactions: {
        Row: {
          account_from: string
          amount: number
          id: string
          transaction_id: string
        }
        Insert: {
          account_from: string
          amount: number
          id?: string
          transaction_id: string
        }
        Update: {
          account_from?: string
          amount?: number
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_transactions_account_from_fkey"
            columns: ["account_from"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          category_id: string
          created_at: string
          date: string
          id: string
        }
        Insert: {
          account_id: string
          category_id: string
          created_at?: string
          date: string
          id?: string
        }
        Update: {
          account_id?: string
          category_id?: string
          created_at?: string
          date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_transactions: {
        Row: {
          account_from: string
          account_to: string
          amount: number
          id: string
          transaction_id_from: string
          transaction_id_to: string
        }
        Insert: {
          account_from: string
          account_to: string
          amount: number
          id?: string
          transaction_id_from: string
          transaction_id_to: string
        }
        Update: {
          account_from?: string
          account_to?: string
          amount?: number
          id?: string
          transaction_id_from?: string
          transaction_id_to?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_transactions_account_from_fkey1"
            columns: ["account_from"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_transactions_account_to_fkey1"
            columns: ["account_to"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_transactions_transaction_id_from_fkey"
            columns: ["transaction_id_from"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_transactions_transaction_id_to_fkey"
            columns: ["transaction_id_to"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birth_date: string
          budget: number | null
          created_at: string
          id: string
          username: string
        }
        Insert: {
          birth_date: string
          budget?: number | null
          created_at?: string
          id?: string
          username: string
        }
        Update: {
          birth_date?: string
          budget?: number | null
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
