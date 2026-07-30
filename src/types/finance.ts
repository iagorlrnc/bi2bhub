export type CobrancaType = 'plano' | 'honorarios' | 'servico_extra' | 'imposto_taxa' | 'outros'
export type CobrancaStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado' | 'em_processamento'
export type ReceiptStatus = 'sem_comprovante' | 'pendente_aprovacao' | 'aprovado' | 'rejeitado'
export type PaymentMethod = 'pix' | 'boleto' | 'cartao' | 'transferencia' | 'manual'

export interface Cobranca {
  id: string
  company_id: string
  company_name?: string
  title: string
  description?: string
  type: CobrancaType
  amount: number
  due_date: string // YYYY-MM-DD
  status: CobrancaStatus
  reference_period: string // MM/YYYY
  pix_code?: string
  pix_qrcode_url?: string
  boleto_barcode?: string
  boleto_url?: string
  receipt_url?: string
  receipt_name?: string
  receipt_uploaded_at?: string
  receipt_status?: ReceiptStatus
  paid_at?: string
  payment_method?: PaymentMethod
  notes?: string
  created_at: string
  created_by?: string
}

export interface PlanoEmpresa {
  company_id: string
  company_name?: string
  plan_name: string // 'Básico' | 'Pró' | 'Plus'
  monthly_amount: number
  due_day: number // 1..31
  status: 'ativo' | 'suspenso' | 'cancelado'
  auto_generate: boolean
  updated_at: string
}

export interface FinancialSummary {
  totalPending: number
  totalOverdue: number
  totalPaid: number
  totalMonthlyActive: number
  countPending: number
  countOverdue: number
  countPaid: number
  countPendingReceipts: number
}

export interface NovoCobrancaPayload {
  company_id: string
  title: string
  type: CobrancaType
  amount: number
  due_date: string
  reference_period: string
  description?: string
  pix_code?: string
  boleto_barcode?: string
  send_notification?: boolean
}
