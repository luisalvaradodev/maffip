import { redirect } from 'next/navigation';

export default function DashboardHome() {
  // Redirige al login si no hay un ID de usuario
  redirect('/login');
}