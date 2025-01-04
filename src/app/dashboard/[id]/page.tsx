'use client'

import { Suspense, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, User, TrendingUp, Bell, Sun, Moon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

function DashboardSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-background min-h-screen animate-pulse">
      <div className="h-9 w-64 bg-muted rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 h-64 bg-muted rounded"></div>
    </div>
  );
}

const MotionCard = motion(Card);

function DashboardContent({ id }: { id: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/dashboard?id=${id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch dashboard data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          notFound();
        }
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    }

    fetchData();
  }, [id]);

  if (!dashboardData) {
    return <DashboardSkeleton />;
  }

  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-7xl mx-auto bg-background min-h-screen"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {dashboardData.userInfo?.login || 'User'}
        </h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <Moon className="h-4 w-4" />
        </div>
      </div>
      <p className="mb-8 text-muted-foreground">Here are your latest stats:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalSales}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </MotionCard>
        <MotionCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.availableProducts}</div>
            <p className="text-xs text-muted-foreground">+15 new this week</p>
          </CardContent>
        </MotionCard>
        <MotionCard
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.userInfo?.status || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Active for 3 months</p>
          </CardContent>
        </MotionCard>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">You have 3 new notifications</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-500">Your sales are up 12% this week</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {/* @ts-expect-error Async Server Component */}
      <DashboardContent id={params.id} />
    </Suspense>
  );
}

