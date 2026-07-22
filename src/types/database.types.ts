// Database types for translated PT-BR schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          company_id: string | null
          codigo_empresa: string | null
          status_reason: string | null
          user_type: UserType
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          company_id?: string | null
          codigo_empresa?: string | null
          status_reason?: string | null
          user_type?: UserType
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          company_id?: string | null
          codigo_empresa?: string | null
          status_reason?: string | null
          user_type?: UserType
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      empresas: {
        Row: {
          id: string
          name: string
          trade_name: string | null
          cnpj: string
          codigo_exclusivo: string | null
          state_registration: string | null
          municipal_registration: string | null
          email: string | null
          phone: string | null
          address_street: string | null
          address_number: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_city: string | null
          address_state: string | null
          address_zip: string | null
          logo_url: string | null
          plan: CompanyPlan
          max_users: number
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          trade_name?: string | null
          cnpj: string
          codigo_exclusivo?: string | null
          state_registration?: string | null
          municipal_registration?: string | null
          email?: string | null
          phone?: string | null
          address_street?: string | null
          address_number?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_city?: string | null
          address_state?: string | null
          address_zip?: string | null
          logo_url?: string | null
          plan?: CompanyPlan
          max_users?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          trade_name?: string | null
          cnpj?: string
          codigo_exclusivo?: string | null
          state_registration?: string | null
          municipal_registration?: string | null
          email?: string | null
          phone?: string | null
          address_street?: string | null
          address_number?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_city?: string | null
          address_state?: string | null
          address_zip?: string | null
          logo_url?: string | null
          plan?: CompanyPlan
          max_users?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      usuarios_empresa: {
        Row: {
          id: string
          company_id: string
          user_id: string
          role: ClientRole
          permissions: string[]
          is_active: boolean
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          role?: ClientRole
          permissions?: string[]
          is_active?: boolean
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          role?: ClientRole
          permissions?: string[]
          is_active?: boolean
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      pastas: {
        Row: {
          id: string
          company_id: string
          parent_id: string | null
          name: string
          color: string
          icon: string
          created_by: string
          is_sistema: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          parent_id?: string | null
          name: string
          color?: string
          icon?: string
          created_by: string
          is_sistema?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          parent_id?: string | null
          name?: string
          color?: string
          icon?: string
          created_by?: string
          is_sistema?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      documentos: {
        Row: {
          id: string
          company_id: string
          folder_id: string | null
          name: string
          description: string | null
          file_path: string
          file_size: number
          mime_type: string
          version: number
          category: DocumentCategory | null
          tags: string[]
          is_favorite: boolean
          uploaded_by: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          folder_id?: string | null
          name: string
          description?: string | null
          file_path: string
          file_size: number
          mime_type: string
          version?: number
          category?: DocumentCategory | null
          tags?: string[]
          is_favorite?: boolean
          uploaded_by: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          folder_id?: string | null
          name?: string
          description?: string | null
          file_path?: string
          file_size?: number
          mime_type?: string
          version?: number
          category?: DocumentCategory | null
          tags?: string[]
          is_favorite?: boolean
          uploaded_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      chamados: {
        Row: {
          id: string
          company_id: string
          ticket_number: number
          subject: string
          description: string
          status: TicketStatus
          priority: TicketPriority
          category: TicketCategory | null
          created_by: string
          assigned_to: string | null
          resolved_at: string | null
          closed_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          subject: string
          description: string
          status?: TicketStatus
          priority?: TicketPriority
          category?: TicketCategory | null
          created_by: string
          assigned_to?: string | null
          resolved_at?: string | null
          closed_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          subject?: string
          description?: string
          status?: TicketStatus
          priority?: TicketPriority
          category?: TicketCategory | null
          created_by?: string
          assigned_to?: string | null
          resolved_at?: string | null
          closed_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      mensagens_chamado: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string
          content: string
          attachments: Json
          is_internal: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id: string
          content: string
          attachments?: Json
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string
          content?: string
          attachments?: Json
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notificacoes: {
        Row: {
          id: string
          user_id: string
          company_id: string | null
          title: string
          message: string
          type: NotificationType
          action_url: string | null
          is_read: boolean
          deleted_by_client: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id?: string | null
          title: string
          message: string
          type?: NotificationType
          action_url?: string | null
          is_read?: boolean
          deleted_by_client?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string | null
          title?: string
          message?: string
          type?: NotificationType
          action_url?: string | null
          is_read?: boolean
          deleted_by_client?: boolean | null
          created_at?: string
        }
      }
      atividades: {
        Row: {
          id: string
          company_id: string | null
          user_id: string
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: never
      }
      eventos_monitoramento: {
        Row: {
          id: string
          company_id: string
          event_type: DocumentCategory
          title: string
          description: string | null
          status: MonitoringStatus
          severity: Severity
          due_date: string | null
          resolved_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          event_type: DocumentCategory
          title: string
          description?: string | null
          status?: MonitoringStatus
          severity?: Severity
          due_date?: string | null
          resolved_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          event_type?: DocumentCategory
          title?: string
          description?: string | null
          status?: MonitoringStatus
          severity?: Severity
          due_date?: string | null
          resolved_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      metricas_painel: {
        Row: {
          id: string
          company_id: string
          metric_type: MetricType
          value: number
          period: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          metric_type: MetricType
          value: number
          period: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          metric_type?: MetricType
          value?: number
          period?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      convites: {
        Row: {
          id: string
          company_id: string
          email: string
          role: ClientRole
          permissions: string[]
          token: string
          invited_by: string
          accepted_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          email: string
          role?: ClientRole
          permissions?: string[]
          token: string
          invited_by: string
          accepted_at?: string | null
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          email?: string
          role?: ClientRole
          permissions?: string[]
          token?: string
          invited_by?: string
          accepted_at?: string | null
          expires_at?: string
          created_at?: string
        }
      }
      configuracoes: {
        Row: {
          id: string
          company_id: string
          notification_email: boolean
          notification_push: boolean
          notification_ticket: boolean
          notification_document: boolean
          theme: ThemePreference
          language: string
          timezone: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          notification_email?: boolean
          notification_push?: boolean
          notification_ticket?: boolean
          notification_document?: boolean
          theme?: ThemePreference
          language?: string
          timezone?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          notification_email?: boolean
          notification_push?: boolean
          notification_ticket?: boolean
          notification_document?: boolean
          theme?: ThemePreference
          language?: string
          timezone?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      admin_redefinir_senha_usuario: {
        Args: {
          target_user_id: string
          new_password: string
        }
        Returns: void
      }
    }
    Enums: {
      user_type: UserType
      plano_empresa: CompanyPlan
      funcao_cliente: ClientRole
      status_chamado: TicketStatus
      prioridade_chamado: TicketPriority
      categoria_documento: DocumentCategory
      tipo_notificacao: NotificationType
    }
  }
}

// ===== Enum Types =====
export type UserType = 'admin' | 'staff' | 'client_master' | 'client_user'
export type CompanyPlan = 'básico' | 'pró' | 'plus'
export type ClientRole = 'usuario_master' | 'usuario_comum'
export type TicketStatus = 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'resolvido' | 'fechado'
export type TicketPriority = 'baixa' | 'media' | 'alta' | 'urgente'
export type TicketCategory = 'fiscal' | 'contabil' | 'trabalhista' | 'societario' | 'tecnologia' | 'financeiro' | 'outros'
export type DocumentCategory = 'fiscal' | 'contabil' | 'trabalhista' | 'societario' | 'certidao' | 'contrato' | 'relatorio' | 'outros'
export type NotificationType = 'info' | 'alerta' | 'sucesso' | 'erro' | 'chamado' | 'documento' | 'sistema'
export type XmlType = 'nfe' | 'nfce' | 'nfse' | 'cte' | 'mdfe'
export type XmlStatus = 'authorized' | 'cancelled' | 'denied' | 'processing'
export type IndicatorType = 'revenue' | 'expenses' | 'profit' | 'tax_burden' | 'growth' | 'cost_reduction' | 'roi' | 'custom'
export type MonitoringEventType = 'fiscal' | 'contabil' | 'trabalhista' | 'societario' | 'certidao' | 'contrato' | 'relatorio' | 'outros'
export type MonitoringStatus = 'pendente' | 'regular' | 'irregular' | 'expirado' | 'alerta'
export type Severity = 'info' | 'baixa' | 'media' | 'alta' | 'critica'
export type MetricType = 'faturamento' | 'despesas' | 'notas_emitidas' | 'notas_recebidas' | 'pendencias' | 'chamados_abertos' | 'total_documentos'
export type ThemePreference = 'light' | 'dark' | 'system'

// ===== Helper types =====
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
