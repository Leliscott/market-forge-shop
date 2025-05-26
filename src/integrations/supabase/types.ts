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
      agent_secrets: {
        Row: {
          agent_email: string
          created_at: string | null
          created_by: string | null
          id: string
          secret_key: string
          updated_at: string | null
        }
        Insert: {
          agent_email: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          secret_key: string
          updated_at?: string | null
        }
        Update: {
          agent_email?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          secret_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          agent_id: string
          cellphone: string
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          user_id: string | null
        }
        Insert: {
          agent_id: string
          cellphone: string
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          cellphone?: string
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_tokens: {
        Row: {
          created_at: string
          customer_id: string
          first_chat_date: string
          id: string
          last_chat_date: string
          seller_id: string
          store_id: string
          store_name: string
          total_messages: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          first_chat_date?: string
          id?: string
          last_chat_date?: string
          seller_id: string
          store_id: string
          store_name: string
          total_messages?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          first_chat_date?: string
          id?: string
          last_chat_date?: string
          seller_id?: string
          store_id?: string
          store_name?: string
          total_messages?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_tokens_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          last_message_at: string
          seller_id: string
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          last_message_at?: string
          seller_id: string
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          last_message_at?: string
          seller_id?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_services: {
        Row: {
          charge_amount: number
          created_at: string
          id: string
          is_active: boolean
          service_name: string
          service_type: string
          store_id: string
          updated_at: string
        }
        Insert: {
          charge_amount: number
          created_at?: string
          id?: string
          is_active?: boolean
          service_name: string
          service_type: string
          store_id: string
          updated_at?: string
        }
        Update: {
          charge_amount?: number
          created_at?: string
          id?: string
          is_active?: boolean
          service_name?: string
          service_type?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_services_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      email_payments: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          email_sent_at: string | null
          id: string
          order_id: string
          payment_confirmed: boolean | null
          payment_link_token: string
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          email_sent_at?: string | null
          id?: string
          order_id: string
          payment_confirmed?: boolean | null
          payment_link_token: string
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          email_sent_at?: string | null
          id?: string
          order_id?: string
          payment_confirmed?: boolean | null
          payment_link_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_payments_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity_change: number | null
          store_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity_change?: number | null
          store_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity_change?: number | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_logs_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_verifications: {
        Row: {
          id: string
          id_document_url: string
          merchant_name: string
          notes: string | null
          owner_id: string
          owner_name: string
          processed_at: string | null
          processed_by: string | null
          selfie_url: string
          status: string
          store_id: string
          submission_date: string | null
        }
        Insert: {
          id?: string
          id_document_url: string
          merchant_name: string
          notes?: string | null
          owner_id: string
          owner_name: string
          processed_at?: string | null
          processed_by?: string | null
          selfie_url: string
          status?: string
          store_id: string
          submission_date?: string | null
        }
        Update: {
          id?: string
          id_document_url?: string
          merchant_name?: string
          notes?: string | null
          owner_id?: string
          owner_name?: string
          processed_at?: string | null
          processed_by?: string | null
          selfie_url?: string
          status?: string
          store_id?: string
          submission_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_verifications_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_verifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      order_financials: {
        Row: {
          created_at: string
          delivery_charge: number | null
          gross_amount: number
          id: string
          marketplace_fee: number
          net_amount: number
          order_id: string
          seller_profit: number
          store_id: string
          vat_amount: number
        }
        Insert: {
          created_at?: string
          delivery_charge?: number | null
          gross_amount: number
          id?: string
          marketplace_fee: number
          net_amount: number
          order_id: string
          seller_profit: number
          store_id: string
          vat_amount: number
        }
        Update: {
          created_at?: string
          delivery_charge?: number | null
          gross_amount?: number
          id?: string
          marketplace_fee?: number
          net_amount?: number
          order_id?: string
          seller_profit?: number
          store_id?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_financials_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_financials_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          delivery_charge: number | null
          delivery_service_id: string | null
          email_payment_id: string | null
          id: string
          items: Json | null
          paid_amount: number | null
          payment_date: string | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          seller_contact: string | null
          shipping_address: Json | null
          status: string
          store_id: string
          store_name: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          delivery_charge?: number | null
          delivery_service_id?: string | null
          email_payment_id?: string | null
          id?: string
          items?: Json | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          seller_contact?: string | null
          shipping_address?: Json | null
          status?: string
          store_id: string
          store_name?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          delivery_charge?: number | null
          delivery_service_id?: string | null
          email_payment_id?: string | null
          id?: string
          items?: Json | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          seller_contact?: string | null
          shipping_address?: Json | null
          status?: string
          store_id?: string
          store_name?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_service_id_fkey"
            columns: ["delivery_service_id"]
            isOneToOne: false
            referencedRelation: "delivery_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_email_payment_id_fkey"
            columns: ["email_payment_id"]
            isOneToOne: false
            referencedRelation: "email_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          is_new_listing: boolean | null
          name: string
          price: number
          stock_quantity: number | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_new_listing?: boolean | null
          name: string
          price: number
          stock_quantity?: number | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_new_listing?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_terms: boolean | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_terms?: boolean | null
          created_at?: string | null
          email?: string | null
          id: string
          location?: string | null
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_terms?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seller_accounts: {
        Row: {
          available_balance: number
          created_at: string
          id: string
          pending_balance: number
          store_id: string
          total_earnings: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          store_id: string
          total_earnings?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          store_id?: string
          total_earnings?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_accounts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          logo: string | null
          name: string
          owner_id: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          owner_id: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          owner_id?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          account_holder_name: string
          account_number: string
          amount: number
          bank_name: string
          branch_code: string
          created_at: string
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          seller_id: string
          status: string
          store_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          amount: number
          bank_name: string
          branch_code: string
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          seller_id: string
          status?: string
          store_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          amount?: number
          bank_name?: string
          branch_code?: string
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          seller_id?: string
          status?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_new_listing_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
