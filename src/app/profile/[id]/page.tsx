'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from '@/features/data/types/index';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PencilIcon, UserIcon, Cog8ToothIcon, StarIcon, ShieldCheckIcon, InboxIcon } from '@heroicons/react/24/solid'; // Más iconos
import { Badge } from "@/components/ui/badge"; // Asumiendo que tienes un componente Badge
import { useToast } from "@/hooks/use-toast"; // Importar el hook para el toast
import { motion } from 'framer-motion'; // Para animaciones suaves

export default function ProfilePage() {
  const params = useParams();
  const { toast } = useToast(); // Usar el hook useToast
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Controlar si se está editando
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!params.id) {
        setError('Profile ID is missing');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/profile?id=${params.id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!profile) return;

    try {
      const res = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setIsEditing(false);  // Disable editing mode after save
      toast({
        title: "Profile updated successfully!",
        description: "Your profile changes have been saved.",
        variant: 'default', // You can customize the variant, e.g., 'success', 'error', etc.
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: "There was an error while updating your profile. Please try again.",
        variant: 'destructive', // Customize for errors
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);  // Toggle the editing state
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-gray-900 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Card className="max-w-lg w-full shadow-md rounded-lg bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 text-lg font-bold">{error}</p>
            <Button className="mt-4 bg-gray-600 text-white" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-black text-lg">No profile found</div>
      </div>
    );
  }

  // Determine status badge color
  const statusColor = profile.status === 'active' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-white text-gray-900 p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-4">
        {/* Profile Header */}
        <Card className="shadow-lg rounded-lg bg-white p-6">
          <CardHeader className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={profile.img} alt={profile.login} />
                <AvatarFallback>{profile.login[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-2xl font-semibold text-white">{profile.login}</CardTitle>
                <p className="text-md text-gray-200">{profile.permissao}</p>
                {/* Status Badge */}
                <Badge className={`px-3 py-1 rounded-full text-white ${statusColor}`}>
                  {profile.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {/* Medals & Badges Section */}
            <div className="flex items-center space-x-4">
              {/* Star Medals */}
              {profile.bonus && (
                <Badge className="flex items-center space-x-2 bg-yellow-400 text-white py-1 px-3 rounded-full">
                  <StarIcon className="w-5 h-5 text-yellow-600" />
                  <span>Bonus: {profile.bonus}</span>
                </Badge>
              )}
              {/* Shield Badge for verified or protected status */}
              <Badge className="flex items-center space-x-2 bg-indigo-600 text-white py-1 px-3 rounded-full">
                <ShieldCheckIcon className="w-5 h-5 text-indigo-300" />
                <span>Verified</span>
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Profile Card */}
        <Card className="shadow-md rounded-lg bg-white p-6">
          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="flex justify-start space-x-4 p-2 bg-gray-100 rounded-lg">
              <TabsTrigger value="overview" className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-200">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-200">
                <PencilIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Edit</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-200">
                <Cog8ToothIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-200">
                <InboxIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Notifications</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <Card className="shadow-md p-6 rounded-lg bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">User Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Username:</p>
                        <Input
                          type="text"
                          name="login"
                          value={profile.login}
                          onChange={handleInputChange}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Permission:</p>
                        <Input
                          type="number"
                          name="permissao"
                          value={profile.permissao || ''}
                          onChange={handleInputChange}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Bonus:</p>
                        <Input
                          type="number"
                          name="bonus"
                          value={profile.bonus || ''}
                          onChange={handleInputChange}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Token:</p>
                        <Input
                          type="text"
                          name="token"
                          value={profile.token || ''}
                          onChange={handleInputChange}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Edit Tab */}
            <TabsContent value="edit">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <Card className="shadow-md p-6 rounded-lg bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Edit User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Username:</p>
                        <Input
                          type="text"
                          name="login"
                          value={profile.login}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Permission:</p>
                        <Input
                          type="text"
                          name="permissao"
                          value={profile.permissao || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Bonus:</p>
                        <Input
                          type="number"
                          name="bonus"
                          value={profile.bonus || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Token:</p>
                        <Input
                          type="text"
                          name="token"
                          value={profile.token || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      {isEditing && (
                        <Button
                          onClick={handleSaveChanges}
                          className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500"
                        >
                          Save Changes
                        </Button>
                      )}
                      <Button
                        onClick={toggleEditMode}
                        className="bg-gray-600 text-white px-4 py-2 hover:bg-gray-500"
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
