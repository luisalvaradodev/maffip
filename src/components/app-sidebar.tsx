'use client';

import { useUser } from '@/app/context/UserContext';
import { Home, User, Users, Settings, LayoutDashboard, Backpack, Group, MessagesSquare, Send, UserRoundSearch, QrCode, ChevronLeft, Gift } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AppSidebar() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading || !user) return null;

  const items = [
    { title: 'Admin', url: `/admin`, icon: Home },
    { title: 'Profile', url: `/profile/${user.id}`, icon: User },
    { title: 'Contatos', url: `/contacts`, icon: UserRoundSearch },
    { title: 'Textos', url: `/textos`, icon: Send },
    { title: 'Gifts', url: `/gifts`, icon: Gift },
    { title: 'Whatsapp', url: `/whatsapp`, icon: QrCode },
    { title: 'Grupos', url: `/groups`, icon: MessagesSquare },
    { title: 'Produtos', url: `/products`, icon: Backpack },
    { title: 'Categorias', url: `/categories`, icon: Group },
  ];

  if (user.permissao === 1) {
    items.push(
      { title: 'Admin Dashboard', url: '/admin', icon: LayoutDashboard },
      { title: 'User Management', url: '/admin/users', icon: Users },
      { title: 'Instance Management', url: '/admin/instances', icon: Settings }
    );
  }

  return (
    <Sidebar className={`
      fixed top-0 left-0 h-screen
      transition-all duration-300 ease-out
      ${isCollapsed ? 'w-[68px]' : 'w-[240px]'}
      bg-white dark:bg-gray-900
      border-r border-gray-100 dark:border-gray-800
      shadow-sm
    `}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 
                flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white text-lg font-bold">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 
                  bg-clip-text text-transparent">Maffi</span>
                <span className="text-[10px] text-gray-400">Dashboard</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ backgroundColor: 'rgb(243 244 246)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg transition-colors"
        >
          <ChevronLeft className={`h-4 w-4 text-gray-400 transition-transform duration-300 
            ${isCollapsed ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.url} 
                        className={`
                          group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200 ease-out
                          ${isActive 
                            ? 'bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                        `}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative"
                        >
                          <item.icon className={`
                            h-[18px] w-[18px] transition-colors duration-200
                            ${isActive 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}
                          `} />
                          {isActive && (
                            <motion.div
                              layoutId="iconGlow"
                              className="absolute inset-0 blur-sm bg-blue-400/40 dark:bg-blue-500/40"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </motion.div>
                        
                        {!isCollapsed && (
                          <span className={`
                            text-sm transition-colors duration-200 whitespace-nowrap
                            ${isActive 
                              ? 'text-blue-600 dark:text-blue-400 font-medium' 
                              : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}
                          `}>
                            {item.title}
                          </span>
                        )}

                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-[6px] bottom-[6px] w-0.5 bg-blue-600 
                              dark:bg-blue-400 rounded-full"
                            initial={false}
                            transition={{ 
                              type: "spring", 
                              stiffness: 300, 
                              damping: 30 
                            }}
                          />
                        )}
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