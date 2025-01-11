"use client";

import { useState, useEffect } from "react";
import { UserForm } from "@/components/UserForm";
import { UserList, User } from "@/components/UserList";
import { InstanceManager } from "@/components/InstanceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import { LoadingSpinner } from "@/components/admin/dashboard/loading-spinner";
import { ErrorDisplay } from "@/components/admin/dashboard/error-display";
import { AdminHeader } from "@/components/admin/dashboard/admin-header";

interface Instance {
  instance: {
    instanceName: string;
    status: string;
    serverUrl: string;
  };
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  // Función para obtener los datos
  const fetchData = async () => {
    try {
      setError(null);
      await Promise.all([fetchUsers(), fetchInstances()]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Falha ao carregar os dados do painel. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Efecto para refrescar los datos cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // Refresca cada 1 segundo (1000 ms)

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Falha ao buscar usuários");
    const data = await response.json();
    if (Array.isArray(data)) {
      setUsers(data);
    }
  };

  const fetchInstances = async () => {
    const response = await fetch("/api/instances");
    if (!response.ok) throw new Error("Falha ao buscar instâncias");
    const data = await response.json();
    if (Array.isArray(data)) {
      setInstances(data);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateUser = async (userData: any, instanceData: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData, instanceData }),
      });

      if (response.ok) {
        await fetchData();
        toast({
          title: "Sucesso",
          description: "Usuário e instância foram criados com sucesso.",
        });
      } else {
        throw new Error("Falha ao criar usuário e instância");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar usuário e instância. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        await fetchUsers();
        toast({
          title: "Sucesso",
          description: "Usuário foi atualizado com sucesso.",
        });
      } else {
        throw new Error("Falha ao atualizar usuário");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar usuário. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers();
        toast({
          title: "Sucesso",
          description: "Usuário foi excluído com sucesso.",
        });
      } else {
        throw new Error("Falha ao excluir usuário");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 bg-background"
    >
      <AdminHeader onCreateUser={() => setIsCreateUserDialogOpen(true)} />
      <StatsCards usersCount={users.length} instancesCount={instances.length} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="transition-all duration-200 hover:bg-muted">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="instances" className="transition-all duration-200 hover:bg-muted">
              Instâncias
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <UserList 
                  users={users} 
                  onUpdate={handleUpdateUser}
                  onDelete={handleDeleteUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="instances">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <InstanceManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <UserForm
        mode="create"
        onSubmit={handleCreateUser}
        open={isCreateUserDialogOpen}
        onOpenChange={setIsCreateUserDialogOpen}
      />
    </motion.div>
  );
}