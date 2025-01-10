'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/app/context/UserContext';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes'; // Importamos useTheme para manejar el tema

// Componente para las estrellas que caen
const Star = ({ id }: { id: number }) => {
  const x = Math.random() * 100; // Posición horizontal aleatoria
  const duration = Math.random() * 5 + 3; // Duración aleatoria entre 3 y 8 segundos

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: '100vh', opacity: [0, 1, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: 'linear',
      }}
      className="absolute w-1 h-1 bg-foreground/50 rounded-full"
      style={{ left: `${x}%` }}
    />
  );
};

// Componente para los cometas
const Comet = ({ id }: { id: number }) => {
  const x = Math.random() * 100; // Posición horizontal aleatoria
  const y = Math.random() * 100; // Posición vertical aleatoria
  const duration = Math.random() * 10 + 5; // Duración aleatoria entre 5 y 15 segundos

  return (
    <motion.div
      initial={{ x: -100, y: -100, opacity: 0 }}
      animate={{ x: '100vw', y: '100vh', opacity: [0, 1, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        delay: Math.random() * 10,
        ease: 'linear',
      }}
      className="absolute w-2 h-2 bg-primary/50 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
};

// Componente para las partículas del estallido
const Particle = ({ id, angle, distance }: { id: number; angle: number; distance: number }) => {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0 }}
      animate={{ opacity: 0, scale: 1, x: distance * Math.cos(angle), y: distance * Math.sin(angle) }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="absolute w-2 h-2 bg-primary rounded-full"
    />
  );
};

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar la animación de despegue
  const [showExplosion, setShowExplosion] = useState(false); // Estado para controlar el estallido
  const router = useRouter();
  const { setUser } = useUser();
  const { theme } = useTheme(); // Obtenemos el tema actual

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!login || !password) {
      setError('Por favor, preencha ambos campos');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setUser({
          id: data.id,
          login: data.login,
          status: data.status,
          permissao: 0,
        });

        // Mostrar toast de sucesso
        toast({
          title: 'Login bem-sucedido!',
          description: 'Você foi autenticado com sucesso.',
          variant: 'default',
        });

        // Ativar a animação de despegue e o estallido
        setIsLoggedIn(true);
        setShowExplosion(true);

        // Redirecionar após a animação
        setTimeout(() => {
          router.push(`/admin`);
        }, 1500); // Duração da animação
      } else {
        setError(data.error || 'Falha no login');

        // Mostrar toast de erro
        toast({
          title: 'Falha no login',
          description: data.error || 'Por favor, verifique suas credenciais e tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');

      // Mostrar toast de erro
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Fondo dinámico com estrelas e cometas */}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
          <Star key={`star-${i}`} id={i} />
        ))}
        {[...Array(3)].map((_, i) => (
          <Comet key={`comet-${i}`} id={i} />
        ))}
      </div>

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Título estilizado com ícone acima */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          {/* Ícone de bolsa de compras */}
          <motion.div
            animate={isLoggedIn ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <ShoppingBag className="h-16 w-16 text-primary mb-4" /> {/* Ícone grande e centralizado */}
          </motion.div>
          {/* Título estilizado */}
          <motion.h1
            className="text-6xl font-bold text-center flex items-baseline gap-2"
            animate={isLoggedIn ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <span className="text-primary">VM</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-black'}>STORE</span> {/* Muda a cor conforme o tema */}
            <span className="text-primary">PRO</span>
          </motion.h1>
        </motion.div>

        {/* Efeito de estouro */}
        <AnimatePresence>
          {showExplosion && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {[...Array(20)].map((_, i) => (
                <Particle
                  key={`particle-${i}`}
                  id={i}
                  angle={(i * 18 * Math.PI) / 180} // Ângulo em radianos
                  distance={100} // Distância do estouro
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulário de login */}
        <form
          onSubmit={handleSubmit}
          className="bg-background border border-border rounded-2xl shadow-lg p-10"
        >
          <div className="space-y-8">
            {/* Campo de usuário */}
            <div>
              <Label htmlFor="login" className="block text-lg font-medium text-foreground mb-3">
                Usuário
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <Input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            {/* Campo de senha */}
            <div>
              <Label htmlFor="password" className="block text-lg font-medium text-foreground mb-3">
                Senha
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 text-lg rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mensagem de erro */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-destructive text-lg mt-6 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Botão de login */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? (
              <motion.div
                className="h-6 w-6 border-t-2 border-primary-foreground rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}