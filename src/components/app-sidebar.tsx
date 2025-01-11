'use client';

import { useUser } from '@/app/context/UserContext';
import { Home, User, Users, Settings, LayoutDashboard, Backpack, Group, MessagesSquare, Send, UserRoundSearch, ChevronLeft, Gift, ChevronDown, LogOut, Database, Icon } from 'lucide-react';
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
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function AppSidebar() {
  const { user, loading, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  if (loading || !user) return null;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  const items = [
    { title: 'Admin', url: `/admin`, icon: Home },
    { title: 'Profile', url: `/profile/${user.id}`, icon: User },
    { 
      title: 'Bot Contas', 
      icon: Database,
      subItems: [
        { title: 'Meus produtos', url: `/products/${user.id}` },
        { title: 'CC/GG', url: `/categoriaCC/${user.id}` },
        { title: 'Textos', url: `/textos/${user.id}` },
      ]
    },
    { 
      title: 'Contatos', 
      icon: UserRoundSearch,
      subItems: [
        { title: 'Meus Contatos', url: `/contacts/${user.id}` },
        { title: 'Clientes', url: `/clients/${user.id}` },
      ]
    },
    { title: 'Gifts', url: `/gifts/${user.id}`, icon: Gift },
    { title: 'Grupos', url: `/groups/${user.id}`, icon: MessagesSquare },
    { title: 'Categorias', url: `/categories/${user.id}`, icon: Group },
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
      {/* Header con estilo macOS */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              {/* Avatar del usuario con menú desplegable */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 focus:outline-none">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 
                      flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <span className="text-white text-lg font-bold">{user.login.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 
                        bg-clip-text text-transparent truncate max-w-[120px]">
                        {user.login}
                      </span>
                      <span className="text-[10px] text-gray-400">Dashboard</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      {/* Contenido del Sidebar */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`); // Verificación mejorada
                const hasSubItems = item.subItems && item.subItems.length > 0;

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasSubItems ? (
                      <>
                        <SidebarMenuButton 
                          onClick={() => setIsContactsOpen(!isContactsOpen)}
                          className={`
                            group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg
                            transition-all duration-200 ease-out
                            hover:bg-gray-50 dark:hover:bg-gray-800/50
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`
                              h-[18px] w-[18px] transition-colors duration-200
                              text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300
                            `} />
                            {!isCollapsed && (
                              <span className={`
                                text-sm transition-colors duration-200 whitespace-nowrap
                                text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200
                              `}>
                                {item.title}
                              </span>
                            )}
                          </div>
                          {!isCollapsed && (
                            <ChevronDown className={`
                              h-4 w-4 text-gray-400 transition-transform duration-200
                              ${isContactsOpen ? 'rotate-180' : ''}
                            `} />
                          )}
                        </SidebarMenuButton>

                        <AnimatePresence>
                          {isContactsOpen && !isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-6"
                            >
                              <ul>
                                {item.subItems.map((subItem) => (
                                  <li key={subItem.title}>
                                    <SidebarMenuButton asChild>
                                      <Link 
                                        href={subItem.url} 
                                        className={`
                                          group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                                          transition-all duration-200 ease-out
                                          ${pathname === subItem.url 
                                            ? 'bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                                        `}
                                      >
                                        <span className={`
                                          text-sm transition-colors duration-200 whitespace-nowrap
                                          ${pathname === subItem.url 
                                            ? 'text-blue-600 dark:text-blue-400 font-medium' 
                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}
                                        `}>
                                          {subItem.title}
                                        </span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
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
                          <item.icon className={`
                            h-[18px] w-[18px] transition-colors duration-200
                            ${isActive 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}
                          `} />
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
                        </Link>
                      </SidebarMenuButton>
                    )}
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