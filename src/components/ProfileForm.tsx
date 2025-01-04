'use client';

import React, { useState, useEffect } from 'react';

interface Profile {
  id: number;
  login: string;
  senha: string;
  permissao: number | null;
  img: string | null;
  token: string | null;
  jwt: string | null;
  data: string | null;
  expirado: number | null;
  status: string | null;
  numero: string | null;
  bot: number | null;
  bonus: number | null;
  afiliado: number | null;
  tokenmp: string | null;
  dono: number | null;
  bonus_pix: number;
  bonus_pix_minimo: number;
}

interface ProfileFormProps {
  userId: number;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile?id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          console.error('Error fetching profile:', res.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => prev && { ...prev, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        console.error('Error updating profile:', res.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white shadow-xl p-8 rounded-lg transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>
      <div>
        <label className="block text-gray-700 font-medium">Login:</label>
        <input
          type="text"
          name="login"
          value={profile.login}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Password:</label>
        <input
          type="password"
          name="senha"
          value={profile.senha}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Status:</label>
        <input
          type="text"
          name="status"
          value={profile.status || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Bonus:</label>
        <input
          type="number"
          name="bonus"
          value={profile.bonus || 0}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Image URL:</label>
        <input
          type="text"
          name="img"
          value={profile.img || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300">
        Save Changes
      </button>
    </form>
  );
};

export default ProfileForm;
