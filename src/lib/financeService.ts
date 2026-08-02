import type {
  Cobranca,
  PlanoEmpresa,
  FinancialSummary,
  NovoCobrancaPayload,
  CobrancaStatus,
  PaymentMethod,
  ReceiptStatus,
  SolicitacaoPlano,
} from '@/types/finance'
import { supabase } from '@/lib/supabase'
import { logAuditActivity } from '@/lib/audit'
import { createAdminNotification } from '@/lib/adminNotifications'
import { ROUTES } from '@/constants/routes'

// Helper para gerar código PIX formatado
export function generateMockPixCode(companyName: string, amount: number, id: string): string {
  const cleanName = companyName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)
  const amountCents = Math.round(amount * 100).toString().padStart(6, '0')
  return `00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405${amountCents}5802BR5915BI2B CONSULTORIA6009SAO PAULO62140510${cleanName}${id.slice(-4)}6304E1A9`
}

// Helper para gerar linha digitável de Boleto formatada
export function generateMockBoletoBarcode(amount: number, dueDate: string): string {
  const cents = Math.round(amount * 100).toString().padStart(10, '0')
  return `34191.79001 01043.510047 91020.150008 8 ${dueDate.replace(/-/g, '').slice(2)}${cents}`
}

export const financeService = {
  // Obter cobranças diretamente do Supabase
  async getCobrancas(companyId?: string): Promise<Cobranca[]> {
    try {
      let query = supabase
        .from('cobrancas')
        .select('*, empresas(id, name, trade_name)')
        .order('created_at', { ascending: false })

      if (companyId && companyId !== 'all') {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('Tabela cobrancas não encontrada ou sem permissão RLS no Supabase:', error.message)
        }
        return []
      }

      // Buscar lista de usuários para resolver o nome real do aprovador pelo ID
      const { data: usersList } = await supabase
        .from('usuarios')
        .select('id, full_name, email')

      const usersMap: Record<string, string> = {}
      if (usersList) {
        for (const u of usersList) {
          usersMap[u.id] = u.full_name || u.email || 'Administrador Bi2B'
        }
      }

      const nowStr = new Date().toISOString().split('T')[0]
      const result: Cobranca[] = (data || []).map((row: any) => {
        const compName = row.empresas?.trade_name || row.empresas?.name || 'Empresa Cliente'
        const isOverdue = row.status === 'pendente' && row.due_date < nowStr

        if (isOverdue) {
          // Atualizar status para 'atrasado' no Supabase de forma assíncrona
          supabase
            .from('cobrancas')
            .update({ status: 'atrasado' })
            .eq('id', row.id)
            .then()
        }

        const realApproverName =
          row.approved_by_name ||
          (row.approved_by ? usersMap[row.approved_by] : undefined) ||
          (row.status === 'pago' ? 'Equipe Contábil Bi2B' : undefined)

        return {
          id: row.id,
          company_id: row.company_id,
          company_name: compName,
          title: row.title,
          description: row.description || '',
          type: row.type || 'honorarios',
          amount: Number(row.amount) || 0,
          due_date: row.due_date,
          status: isOverdue ? 'atrasado' : row.status,
          reference_period: row.reference_period,
          pix_code: row.pix_code || generateMockPixCode(compName, Number(row.amount), row.id),
          boleto_barcode: row.boleto_barcode || generateMockBoletoBarcode(Number(row.amount), row.due_date),
          receipt_url: row.receipt_url || undefined,
          receipt_name: row.receipt_name || undefined,
          receipt_uploaded_at: row.receipt_uploaded_at || undefined,
          receipt_status: row.receipt_status || 'sem_comprovante',
          paid_at: row.paid_at || undefined,
          payment_method: row.payment_method || undefined,
          created_at: row.created_at,
          created_by: row.created_by || undefined,
          approved_by_name: realApproverName,
        }
      })

      return result
    } catch (err) {
      console.error('Erro ao buscar cobranças no Supabase:', err)
      return []
    }
  },

  // Obter detalhes do plano da empresa diretamente do Supabase
  async getCompanyPlan(companyId: string): Promise<PlanoEmpresa | null> {
    if (!companyId || companyId === 'all') return null

    try {
      const { data, error } = await supabase
        .from('planos_empresa')
        .select('*, empresas(id, name, trade_name, plan)')
        .eq('company_id', companyId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.warn('Erro ao consultar planos_empresa:', error.message)
        return null
      }

      if (data) {
        const compName = data.empresas?.trade_name || data.empresas?.name || 'Empresa Cliente'
        return {
          company_id: data.company_id,
          company_name: compName,
          plan_name: data.plan_name || 'Básico',
          monthly_amount: Number(data.monthly_amount) || 0,
          due_day: Number(data.due_day) || 10,
          status: data.status || 'ativo',
          auto_generate: data.auto_generate ?? true,
          updated_at: data.updated_at || new Date().toISOString(),
        }
      }

      // Se ainda não houver registro em `planos_empresa`, consultar o plano cadastrado em `empresas`
      const { data: compData } = await supabase
        .from('empresas')
        .select('id, name, trade_name, plan')
        .eq('id', companyId)
        .single()

      if (compData) {
        const compName = compData.trade_name || compData.name || 'Empresa Cliente'
        const rawPlan = compData.plan || 'básico'
        const formattedPlan = rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1)

        return {
          company_id: compData.id,
          company_name: compName,
          plan_name: formattedPlan,
          monthly_amount: formattedPlan.toLowerCase() === 'plus' ? 1450.00 : formattedPlan.toLowerCase() === 'pró' ? 850.00 : 450.00,
          due_day: 10,
          status: 'ativo',
          auto_generate: true,
          updated_at: new Date().toISOString(),
        }
      }

      return null
    } catch (err) {
      console.error('Erro ao carregar plano no Supabase:', err)
      return null
    }
  },

  // Atualizar plano da empresa no Supabase
  async updateCompanyPlan(companyId: string, planData: Partial<PlanoEmpresa>): Promise<PlanoEmpresa | null> {
    try {
      const payload = {
        company_id: companyId,
        plan_name: planData.plan_name || 'Básico',
        monthly_amount: planData.monthly_amount ?? 0,
        due_day: planData.due_day ?? 10,
        status: planData.status || 'ativo',
        auto_generate: planData.auto_generate ?? true,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('planos_empresa')
        .upsert(payload, { onConflict: 'company_id' })
        .select('*, empresas(id, name, trade_name, plan)')
        .single()

      if (error) throw error

      // Sincronizar também a coluna `plan` na tabela `empresas`
      const pName = data.plan_name.toLowerCase()
      const validPlan = pName.includes('plus') ? 'plus' : pName.includes('pró') ? 'pró' : 'básico'
      await supabase
        .from('empresas')
        .update({ plan: validPlan as any })
        .eq('id', companyId)

      const compName = data.empresas?.trade_name || data.empresas?.name || 'Empresa Cliente'

      window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))

      return {
        company_id: data.company_id,
        company_name: compName,
        plan_name: data.plan_name,
        monthly_amount: Number(data.monthly_amount),
        due_day: Number(data.due_day),
        status: data.status,
        auto_generate: data.auto_generate,
        updated_at: data.updated_at,
      }
    } catch (err) {
      console.error('Erro ao atualizar plano no Supabase:', err)
      throw err
    }
  },

  // Criar nova cobrança no Supabase
  async createCharge(payload: NovoCobrancaPayload, companyName?: string, userId?: string): Promise<Cobranca> {
    const compName = companyName || 'Empresa Cliente'
    const pixCode = payload.pix_code || generateMockPixCode(compName, payload.amount, Date.now().toString())
    const boletoCode = payload.boleto_barcode || generateMockBoletoBarcode(payload.amount, payload.due_date)

    const insertData = {
      company_id: payload.company_id,
      title: payload.title,
      description: payload.description || null,
      type: payload.type,
      amount: payload.amount,
      due_date: payload.due_date,
      status: 'pendente',
      reference_period: payload.reference_period,
      pix_code: pixCode,
      boleto_barcode: boletoCode,
      receipt_status: 'sem_comprovante',
      created_by: userId || null,
    }

    const { data, error } = await supabase
      .from('cobrancas')
      .insert(insertData)
      .select('*, empresas(id, name, trade_name)')
      .single()

    if (error) {
      console.error('Erro Supabase insert cobrancas:', error)
      throw error
    }

    // Log de auditoria
    if (userId) {
      logAuditActivity({
        userId,
        companyId: payload.company_id,
        action: 'financas.cobranca.criar',
        entityType: 'cobranca',
        entityId: data.id,
        metadata: { title: payload.title, amount: payload.amount, due_date: payload.due_date }
      })
    }

    // Enviar notificação se solicitada
    if (payload.send_notification) {
      try {
        const { data: users } = await supabase
          .from('usuarios')
          .select('id')
          .eq('company_id', payload.company_id)

        if (users && users.length > 0) {
          const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload.amount)
          const notifs = users.map((u) => ({
            user_id: u.id,
            company_id: payload.company_id,
            title: `Nova Cobrança: ${payload.title}`,
            message: `Uma nova cobrança no valor de ${formattedValue} com vencimento em ${new Date(payload.due_date + 'T00:00:00').toLocaleDateString('pt-BR')} foi gerada.`,
            type: 'alerta' as const,
            action_url: '/financas',
          }))

          await supabase.from('notificacoes').insert(notifs)
        }
      } catch (err) {
        console.error('Erro ao enviar notificação de cobrança:', err)
      }
    }

    window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))

    return {
      id: data.id,
      company_id: data.company_id,
      company_name: data.empresas?.trade_name || data.empresas?.name || compName,
      title: data.title,
      description: data.description || '',
      type: data.type,
      amount: Number(data.amount),
      due_date: data.due_date,
      status: data.status,
      reference_period: data.reference_period,
      pix_code: data.pix_code,
      boleto_barcode: data.boleto_barcode,
      receipt_status: data.receipt_status,
      created_at: data.created_at,
    }
  },

  // Dar baixa ou atualizar status da cobrança no Supabase
  async updateStatus(
    chargeId: string,
    status: CobrancaStatus,
    options?: {
      paymentMethod?: PaymentMethod
      receiptStatus?: ReceiptStatus
      notes?: string
      userId?: string
      approverName?: string
    }
  ): Promise<boolean> {
    const isPaying = status === 'pago'

    const updatePayload: any = {
      status,
      paid_at: isPaying ? new Date().toISOString() : null,
      payment_method: options?.paymentMethod || (isPaying ? 'pix' : null),
      receipt_status: options?.receiptStatus || (isPaying ? 'aprovado' : 'sem_comprovante'),
      notes: options?.notes || null,
      approved_by_name: isPaying ? (options?.approverName || 'Equipe Contábil Bi2B') : null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('cobrancas')
      .update(updatePayload)
      .eq('id', chargeId)

    if (error) {
      console.error('Erro ao atualizar status da cobrança no Supabase:', error)
      throw error
    }

    if (options?.userId) {
      logAuditActivity({
        userId: options.userId,
        companyId: undefined,
        action: `financas.cobranca.status.${status}`,
        entityType: 'cobranca',
        entityId: chargeId,
        metadata: { status }
      })
    }

    window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
    return true
  },

  // Enviar comprovante de pagamento pelo cliente
  async submitReceipt(
    chargeId: string,
    receiptName: string,
    receiptUrl: string,
    userId?: string
  ): Promise<boolean> {
    const updatePayload = {
      status: 'em_processamento',
      receipt_url: receiptUrl,
      receipt_name: receiptName,
      receipt_uploaded_at: new Date().toISOString(),
      receipt_status: 'pendente_aprovacao',
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('cobrancas')
      .update(updatePayload)
      .eq('id', chargeId)

    if (error) {
      console.error('Erro ao enviar comprovante no Supabase:', error)
      throw error
    }

    if (userId) {
      logAuditActivity({
        userId,
        companyId: undefined,
        action: 'financas.comprovante.enviar',
        entityType: 'cobranca',
        entityId: chargeId,
        metadata: { receipt_name: receiptName }
      })

      try {
        const { data: charge } = await supabase
          .from('cobrancas')
          .select('company_id, title, empresas(name, trade_name)')
          .eq('id', chargeId)
          .single()

        const compName = (charge as any)?.empresas?.trade_name || (charge as any)?.empresas?.name || 'Cliente'
        await createAdminNotification({
          userId,
          companyId: charge?.company_id,
          companyName: compName,
          title: 'Novo Comprovante de Pagamento (Finanças)',
          message: `${compName} enviou o comprovante "${receiptName}" para a cobrança "${charge?.title || 'Fatura'}".`,
          type: 'sucesso',
          actionUrl: ROUTES.ADMIN_FINANCIAL,
        })
      } catch (nErr) {
        if (import.meta.env.DEV) console.warn('Aviso ao notificar admin sobre comprovante:', nErr)
      }
    }

    window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
    return true
  },

  // Avaliar comprovante pelo Admin (Aprovar ou Rejeitar)
  async reviewReceipt(
    chargeId: string,
    approved: boolean,
    notes?: string,
    userId?: string,
    approverName?: string
  ): Promise<boolean> {
    const updatePayload = {
      status: approved ? 'pago' : 'pendente',
      paid_at: approved ? new Date().toISOString() : null,
      receipt_status: approved ? 'aprovado' : 'rejeitado',
      notes: notes || (approved ? 'Comprovante aprovado pelo escritório.' : 'Comprovante rejeitado pelo escritório.'),
      approved_by_name: approved ? (approverName || 'Equipe Contábil Bi2B') : null,
      updated_at: new Date().toISOString(),
    }

    const { data: charge, error } = await supabase
      .from('cobrancas')
      .update(updatePayload)
      .eq('id', chargeId)
      .select('company_id, title')
      .single()

    if (error) {
      console.error('Erro ao avaliar comprovante no Supabase:', error)
      throw error
    }

    // Notificar cliente sobre a validação
    if (charge?.company_id) {
      try {
        const { data: users } = await supabase
          .from('usuarios')
          .select('id')
          .eq('company_id', charge.company_id)

        if (users && users.length > 0) {
          const notifs = users.map((u) => ({
            user_id: u.id,
            company_id: charge.company_id,
            title: approved ? `Pagamento Confirmado!` : `Comprovante Não Aprovado`,
            message: approved
              ? `Seu comprovante para "${charge.title}" foi aprovado com sucesso!`
              : `O comprovante enviado para "${charge.title}" não pôde ser validado: ${notes || 'Verifique o arquivo'}.`,
            type: (approved ? 'sucesso' : 'alerta') as any,
            action_url: '/financas',
          }))

          await supabase.from('notificacoes').insert(notifs)
        }
      } catch (e) {
        console.error('Erro ao notificar validação de comprovante:', e)
      }
    }

    if (userId) {
      logAuditActivity({
        userId,
        companyId: charge?.company_id,
        action: approved ? 'financas.comprovante.aprovar' : 'financas.comprovante.rejeitar',
        entityType: 'cobranca',
        entityId: chargeId,
        metadata: { approved, notes }
      })
    }

    window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
    return true
  },

  // Enviar Lembrete de Cobrança (Admin -> Cliente)
  async sendReminder(chargeId: string, userId?: string): Promise<boolean> {
    const { data: charge } = await supabase
      .from('cobrancas')
      .select('id, company_id, title, amount, due_date')
      .eq('id', chargeId)
      .single()

    if (!charge) return false

    try {
      const { data: users } = await supabase
        .from('usuarios')
        .select('id')
        .eq('company_id', charge.company_id)

      if (users && users.length > 0) {
        const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(charge.amount))
        const formattedDueDate = new Date(charge.due_date + 'T00:00:00').toLocaleDateString('pt-BR')

        const notifs = users.map((u) => ({
          user_id: u.id,
          company_id: charge.company_id,
          title: `Lembrete de Vencimento: ${charge.title}`,
          message: `Lembrete referente ao pagamento de ${formattedValue} com vencimento em ${formattedDueDate}. Acesse a aba de Finanças para realizar o pagamento.`,
          type: 'alerta' as const,
          action_url: '/financas',
        }))

        await supabase.from('notificacoes').insert(notifs)
      }
    } catch (e) {
      console.error('Erro ao enviar lembrete:', e)
    }

    if (userId) {
      logAuditActivity({
        userId,
        companyId: charge.company_id,
        action: 'financas.cobranca.lembrete',
        entityType: 'cobranca',
        entityId: chargeId,
        metadata: { title: charge.title }
      })
    }

    return true
  },

  // Excluir Cobrança no Supabase
  async deleteCharge(chargeId: string, userId?: string): Promise<boolean> {
    const { data: charge } = await supabase
      .from('cobrancas')
      .select('company_id, title')
      .eq('id', chargeId)
      .single()

    const { error } = await supabase
      .from('cobrancas')
      .delete()
      .eq('id', chargeId)

    if (error) {
      console.error('Erro ao excluir cobrança no Supabase:', error)
      throw error
    }

    if (userId && charge) {
      logAuditActivity({
        userId,
        companyId: charge.company_id,
        action: 'financas.cobranca.excluir',
        entityType: 'cobranca',
        entityId: chargeId,
        metadata: { title: charge.title }
      })
    }

    window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
    return true
  },

  // Obter resumo de métricas financeiras a partir da lista real
  getSummary(cobrancas: Cobranca[], activePlanAmount = 0): FinancialSummary {
    let totalPending = 0
    let totalOverdue = 0
    let totalPaid = 0
    let countPending = 0
    let countOverdue = 0
    let countPaid = 0
    let countPendingReceipts = 0

    cobrancas.forEach((c) => {
      if (c.status === 'pendente') {
        totalPending += c.amount
        countPending++
      } else if (c.status === 'atrasado') {
        totalOverdue += c.amount
        countOverdue++
      } else if (c.status === 'pago') {
        totalPaid += c.amount
        countPaid++
      }

      if (c.receipt_status === 'pendente_aprovacao') {
        countPendingReceipts++
      }
    })

    return {
      totalPending,
      totalOverdue,
      totalPaid,
      totalMonthlyActive: activePlanAmount,
      countPending,
      countOverdue,
      countPaid,
      countPendingReceipts,
    }
  },

  // Registrar solicitação de alteração de plano pelo cliente
  async requestPlanChange(payload: {
    companyId: string
    companyName: string
    currentPlan: string
    requestedPlan: string
    notes?: string
    userId?: string
  }): Promise<boolean> {
    try {
      const insertData: any = {
        company_id: payload.companyId,
        company_name: payload.companyName,
        current_plan: payload.currentPlan || 'Básico',
        requested_plan: payload.requestedPlan,
        notes: payload.notes || null,
        status: 'pendente',
        created_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('solicitacoes_plano').insert(insertData)

      // Se falhar por conta da coluna company_name não existir no banco existente, tentar sem company_name
      if (error && error.message?.includes('company_name')) {
        delete insertData.company_name
        const res = await supabase.from('solicitacoes_plano').insert(insertData)
        error = res.error
      }

      if (error) {
        console.error('Erro ao inserir em solicitacoes_plano:', error.message)
        throw error
      }

      // Notificar escritório (se o userId do solicitante for fornecido)
      if (payload.userId) {
        try {
          await supabase.from('notificacoes').insert({
            company_id: payload.companyId,
            user_id: payload.userId,
            title: `Solicitação de Alteração de Plano: ${payload.companyName}`,
            message: `Empresa ${payload.companyName} (Plano Atual: ${payload.currentPlan}) solicitou migração para o Plano ${payload.requestedPlan}. Observações: ${payload.notes || 'Sem observações adicionais.'}`,
            type: 'alerta',
            is_read: false,
          })
        } catch (nErr) {
          if (import.meta.env.DEV) console.warn('Aviso ao gerar notificação de alteração de plano:', nErr)
        }
      }

      if (payload.userId) {
        logAuditActivity({
          userId: payload.userId,
          companyId: payload.companyId,
          action: 'financas.plano.solicitar_alteracao',
          entityType: 'empresas',
          entityId: payload.companyId,
          metadata: { requested_plan: payload.requestedPlan }
        })
      }

      window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
      return true
    } catch (err) {
      console.error('Erro ao solicitar alteração de plano:', err)
      throw err
    }
  },

  // Obter solicitações de alteração de plano
  async getPlanRequests(companyId?: string): Promise<SolicitacaoPlano[]> {
    try {
      let query = supabase
        .from('solicitacoes_plano')
        .select('*, empresas(id, name, trade_name)')
        .order('created_at', { ascending: false })

      if (companyId && companyId !== 'all') {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('Aviso ao consultar solicitacoes_plano:', error.message)
        }
        return []
      }

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          company_id: row.company_id,
          company_name: row.company_name || row.empresas?.trade_name || row.empresas?.name || 'Empresa Cliente',
          current_plan: row.current_plan,
          requested_plan: row.requested_plan,
          notes: row.notes || undefined,
          status: row.status || 'pendente',
          created_at: row.created_at,
          updated_at: row.updated_at || undefined,
          reviewed_by: row.reviewed_by || undefined,
        }))
      }

      return []
    } catch (err) {
      console.error('Erro ao buscar solicitações de plano:', err)
      return []
    }
  },

  // Aprovar solicitação de alteração de plano
  async approvePlanRequest(
    requestId: string,
    companyId: string,
    requestedPlan: string,
    reviewerId?: string,
    reviewerName?: string
  ): Promise<boolean> {
    try {
      const pName = requestedPlan.toLowerCase()
      const defaultAmount = pName.includes('plus') ? 1450.00 : pName.includes('pró') ? 850.00 : 450.00
      const planFormatted = requestedPlan.charAt(0).toUpperCase() + requestedPlan.slice(1)

      // 1. Atualizar o plano da empresa
      await this.updateCompanyPlan(companyId, {
        plan_name: planFormatted,
        monthly_amount: defaultAmount,
        due_day: 10,
      })

      // 2. Atualizar status da solicitação no Supabase
      const { error: updateErr } = await supabase
        .from('solicitacoes_plano')
        .update({
          status: 'aprovado',
          updated_at: new Date().toISOString(),
          reviewed_by: reviewerName || 'Admin',
        })
        .eq('id', requestId)

      if (updateErr) {
        console.error('Erro ao atualizar status para aprovado no Supabase:', updateErr.message)
        // Tentativa de fallback usando apenas ID do usuário se falhar por restrição de tipo
        await supabase
          .from('solicitacoes_plano')
          .update({
            status: 'aprovado',
            updated_at: new Date().toISOString(),
            reviewed_by: reviewerId || null,
          })
          .eq('id', requestId)
      }

      // 3. Notificar o cliente
      const { data: users } = await supabase
        .from('usuarios')
        .select('id')
        .eq('company_id', companyId)

      if (users && users.length > 0) {
        const notifs = users.map((u) => ({
          user_id: u.id,
          company_id: companyId,
          title: 'Solicitação de Plano Aprovada! 🎉',
          message: `Sua solicitação de alteração para o Plano ${planFormatted} foi aprovada com sucesso pelo escritório!`,
          type: 'sucesso' as const,
          action_url: '/financas',
        }))
        await supabase.from('notificacoes').insert(notifs)
      }

      if (reviewerId) {
        logAuditActivity({
          userId: reviewerId,
          companyId,
          action: 'financas.plano.aprovar_alteracao',
          entityType: 'empresas',
          entityId: companyId,
          metadata: { plan_name: planFormatted }
        })
      }

      window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
      return true
    } catch (err) {
      console.error('Erro ao aprovar solicitação de plano:', err)
      throw err
    }
  },

  // Recusar solicitação de alteração de plano
  async rejectPlanRequest(
    requestId: string,
    companyId: string,
    reason?: string,
    reviewerId?: string,
    reviewerName?: string
  ): Promise<boolean> {
    try {
      const { error: updateErr } = await supabase
        .from('solicitacoes_plano')
        .update({
          status: 'recusado',
          updated_at: new Date().toISOString(),
          reviewed_by: reviewerName || 'Admin',
        })
        .eq('id', requestId)

      if (updateErr) {
        console.error('Erro ao recusar no Supabase:', updateErr.message)
        await supabase
          .from('solicitacoes_plano')
          .update({
            status: 'recusado',
            updated_at: new Date().toISOString(),
            reviewed_by: reviewerId || null,
          })
          .eq('id', requestId)
      }

      const { data: users } = await supabase
        .from('usuarios')
        .select('id')
        .eq('company_id', companyId)

      if (users && users.length > 0) {
        const notifs = users.map((u) => ({
          user_id: u.id,
          company_id: companyId,
          title: 'Solicitação de Alteração de Plano',
          message: `Sua solicitação de alteração de plano não pôde ser concluída neste momento. Motivo: ${reason || 'Verifique com seu contador responsável.'}`,
          type: 'alerta' as const,
          action_url: '/financas',
        }))
        await supabase.from('notificacoes').insert(notifs)
      }

      if (reviewerId) {
        logAuditActivity({
          userId: reviewerId,
          companyId,
          action: 'financas.plano.recusar_alteracao',
          entityType: 'empresas',
          entityId: companyId,
          metadata: { reason }
        })
      }

      window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
      return true
    } catch (err) {
      console.error('Erro ao recusar solicitação de plano:', err)
      throw err
    }
  },

  // Excluir solicitação de alteração de plano
  async deletePlanRequest(requestId: string, reviewerId?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('solicitacoes_plano')
        .delete()
        .eq('id', requestId)

      if (error) {
        console.warn('Aviso delete solicitacoes_plano:', error.message)
      }

      if (reviewerId) {
        logAuditActivity({
          userId: reviewerId,
          companyId: '',
          action: 'financas.plano.excluir_solicitacao',
          entityType: 'solicitacoes_plano',
          entityId: requestId
        })
      }

      window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))
      return true
    } catch (err) {
      console.error('Erro ao excluir solicitação de plano:', err)
      throw err
    }
  }
}

