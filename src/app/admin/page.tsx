"use client";

import { useState, useEffect } from "react";
import { UserForm } from "@/components/UserForm";
import { UserList, User } from "@/components/UserList";
import { InstanceManager } from "@/components/InstanceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Import new components
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchUsers(), fetchInstances()]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    if (Array.isArray(data)) {
      setUsers(data);
    }
  };

  const fetchInstances = async () => {
    const response = await fetch("/api/instances");
    if (!response.ok) throw new Error("Failed to fetch instances");
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
          title: "Success",
          description: "User and instance have been created successfully.",
        });
      } else {
        throw new Error("Failed to create user and instance");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user and instance. Please try again.",
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
          title: "Success",
          description: "User has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update user");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
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
          title: "Success",
          description: "User has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete user");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
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
              Users
            </TabsTrigger>
            <TabsTrigger value="instances" className="transition-all duration-200 hover:bg-muted">
              Instances
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