'use client';

import { useUser } from '@/app/context/UserContext';
import { Home, User, Users, Settings, LayoutDashboard, Backpack, Group, MessagesSquare, Send, UserRoundSearch, QrCode } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const { user, loading } = useUser();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const items = [
    {
      title: 'Admin',
      url: `/admin`,
      icon: Home,
    },
    {
      title: 'Profile',
      url: `/profile/${user.id}`,
      icon: User,
    },
    {
      title: 'Contatos',
      url: `/contacts`,
      icon: UserRoundSearch,
    },
    {
      title: 'Textos',
      url: `/textos`,
      icon: Send,
    },
    {
      title: 'Whatsapp',
      url: `/whatsapp`,
      icon: QrCode,
    },
    {
      title: 'Grupos',
      url: `/groups`,
      icon: MessagesSquare,
    },
    {
      title: 'Produtos',
      url: `/products`,
      icon: Backpack,
    },
    {
      title: 'Categorias',
      url: `/categories`,
      icon: Group,
    },
  ];

  if (user.permissao === 1) {
    items.push(
      {
        title: 'Admin Dashboard',
        url: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'User Management',
        url: '/admin/users',
        icon: Users,
      },
      {
        title: 'Instance Management',
        url: '/admin/instances',
        icon: Settings,
      }
    );
  }

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-lg font-bold">Maffi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={`flex items-center space-x-3 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''} px-4 py-2 rounded-md transition-colors duration-200`}>
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`} />
                        <span className={`${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

