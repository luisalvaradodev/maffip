'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from '@/features/data/types/index';
import { User, Star, BadgeCheck, Wallet, Mail, ImageIcon, Edit3, Save, UserCheck, CreditCard, Key } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export default function ProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saveProgress, setSaveProgress] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function fetchProfile() {
      if (!params.id) {
        setError('ID do perfil está faltando');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/profile?id=${params.id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Falha ao buscar perfil');
        }
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        setError('Falha ao carregar perfil. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!profile) return;

    try {
      setSaveProgress(25);
      const res = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      setSaveProgress(75);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao atualizar perfil');
      }

      setSaveProgress(100);
      setIsEditing(false);

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil",
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setSaveProgress(0), 1000);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center p-4 transition-colors duration-300`}
      >
        <Card className="max-w-lg w-full">
          <CardContent className="p-6 text-center space-y-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="text-red-500 text-6xl mb-4"
            >
              ⚠️
            </motion.div>
            <h2 className="text-2xl font-bold">Erro</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button 
              className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
              onClick={() => router.push('/login')}
            >
              Voltar para o Login
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen p-6 md:p-10 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho do Perfil */}
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="relative p-6">
              <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100'} rounded-t-lg transition-colors duration-300`} />
              <div className="relative flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center md:space-x-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-xl transition-all duration-300 hover:ring-primary/40">
                      <AvatarImage src={profile?.img} />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div className="text-center md:text-left space-y-2">
                    <CardTitle className="text-3xl font-bold truncate max-w-[200px] md:max-w-[300px]">
                      {profile?.login}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="bg-primary/20 text-primary transition-colors duration-300 hover:bg-primary/30">
                        <BadgeCheck className="w-4 h-4 mr-1" />
                        Verificado
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-500 text-yellow-900 dark:bg-yellow-300 dark:text-yellow-800 transition-colors duration-300 hover:bg-yellow-400 dark:hover:bg-yellow-200">
                        <Star className="w-4 h-4 mr-1 animate-pulse" />
                        <span className="truncate max-w-[100px]">{profile?.bonus} Pontos</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md text-sm px-3 py-1 rounded-md"
                  >
                    {isEditing ? (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Cancelar
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Conteúdo Principal */}
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[
                  { icon: Mail, label: 'Email', value: profile?.login, key: 'login' },
                  { icon: Key, label: 'Senha', value: profile?.senha, key: 'senha' },
                  { icon: ImageIcon, label: 'Imagem do perfil', value: profile?.img, key: 'img' },
                  { icon: Wallet, label: 'Bônus inicial', value: profile?.bonus, key: 'bonus' },
                  { icon: UserCheck, label: 'Percentual de afiliado', value: profile?.afiliado, key: 'afiliado' },
                  { icon: CreditCard, label: 'Token do Mercado Pago', value: profile?.tokenmp, key: 'tokenmp' },
                  { icon: Wallet, label: 'Bônus PIX em %', value: profile?.bonus_pix, key: 'bonus_pix' },
                  { icon: Wallet, label: 'Mínimo de bônus', value: profile?.bonus_pix_minimo, key: 'bonus_pix_minimo' },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="bg-card hover:bg-card/90 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <field.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm text-muted-foreground">{field.label}</p>
                            {isEditing ? (
                              <Input
                                name={field.key}
                                value={profile?.[field.key as keyof UserProfile] || ''}
                                onChange={handleInputChange}
                                className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-primary"
                              />
                            ) : (
                              <p className="font-medium truncate">
                                {field.value || 'Não definido'}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={handleSaveChanges}
                      className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md text-sm px-4 py-2 rounded-md"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progresso de Salvamento */}
        <AnimatePresence>
          {saveProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Progress value={saveProgress} className="h-2 transition-all duration-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};