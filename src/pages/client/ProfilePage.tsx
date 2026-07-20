import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function ProfilePage() {
  // Redireciona para a página de configurações (a aba de Perfil é o padrão)
  return <Navigate to={ROUTES.SETTINGS} replace />
}
