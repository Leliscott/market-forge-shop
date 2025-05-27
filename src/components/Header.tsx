
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';
import { ThemeToggle } from "./ui/theme-toggle";

interface HeaderProps {
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = true
}) => {
  const {
    user,
    profile,
    isAuthenticated,
    logout
  } = useAuth();
  
  const {
    totalItems
  } = useCart();
  
  const {
    notifications,
    unreadCount,
    markAllAsRead
  } = useNotifications();
  
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo and brand name with unique Shop4ll branding */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="relative">
            {/* Unique Shop4ll Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-teal-600 font-bold text-xs">S4</span>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Shop4ll
            </span>
            <span className="text-xs text-gray-500 -mt-1">Your Trusted Marketplace</span>
          </div>
        </Link>

        {/* Search bar (conditionally rendered) */}
        {showSearch && (
          <div className="hidden w-1/3 md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search for products or stores..." className="pl-8" />
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex items-center space-x-4">
          <Link to="/marketplace" className="hidden text-sm font-medium transition-colors hover:text-primary md:block">
            Marketplace
          </Link>

          {/* Support Email Link */}
          <Button variant="ghost" size="sm" asChild className="hidden md:flex">
            <a href="mailto:mainshop@shop4ll.co.za" className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              Support
            </a>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Buttons for auth */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Cart Icon with counter */}
                <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
                
                {/* Notifications dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => markAllAsRead()}>
                          Mark all as read
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map(notification => (
                        <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{notification.title}</span>
                              {!notification.isRead && <Badge variant="secondary" className="text-xs">New</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications yet
                      </div>
                    )}
                    {notifications.length > 5 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center" asChild>
                          <Link to="/notifications">View all</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{profile?.name}</span>
                        <span className="text-xs text-muted-foreground">{profile?.role}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {profile?.role === 'seller' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/dashboard">Seller Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/products">My Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/orders">Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link to="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
