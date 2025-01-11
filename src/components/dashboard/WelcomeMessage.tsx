import { differenceInDays } from 'date-fns';

export default function WelcomeMessage({ username, expirationDate }: { username: string; expirationDate: string }) {
  const daysRemaining = differenceInDays(new Date(expirationDate), new Date());

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
      <h1 className="text-2xl font-bold">Bienvenido, {username}!</h1>
      <p className="mt-2">Tienes {daysRemaining} días restantes antes de que expire tu acceso.</p>
    </div>
  );
}