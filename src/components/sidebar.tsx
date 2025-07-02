"use client";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Buscar", href: "/search", icon: Search },
  { name: "Tu biblioteca", href: "/library", icon: Library },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <>
      <div className="p-4 lg:p-6">
        <Link to="/" className="flex items-center gap-2">
          <Music className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
          <span className="text-lg lg:text-xl font-bold">Kodigo Music</span>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1 lg:space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm lg:text-base",
                    pathname === item.href && "text-white bg-white/10"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 lg:mt-8 px-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white text-sm lg:text-base py-2.5 lg:py-2"
          >
            <Plus className="w-5 h-5" />
            Crear playlist
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white text-sm lg:text-base py-2.5 lg:py-2"
          >
            <Heart className="w-5 h-5" />
            Canciones que te gustan
          </Button>
        </div>

        <div className="mt-4 px-3 hidden lg:block">
          <div className="text-xs text-gray-500 mb-2">PLAYLISTS RECIENTES</div>
          <div className="space-y-1">
            {["Mi Playlist #1", "Favoritos 2024", "Road Trip Mix"].map(
              (playlist) => (
                <button
                  key={playlist}
                  className="block w-full text-left px-3 py-1 text-sm text-gray-400 hover:text-white truncate"
                >
                  {playlist}
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-800">
        {user ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => logout()}
              className="w-8 h-8 text-gray-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("openLogin"));
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold text-sm lg:text-base"
          >
            Iniciar Sesión
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-black border-r border-gray-800 flex-col">
        <SidebarContent />
      </div>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <Music className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold">Kodigo Music</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 z-40 w-80 h-full bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-sm border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-green-500" : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
          {user && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          )}
        </div>
      </div>
      <div className="lg:hidden h-16" />
      <div className="lg:hidden h-20" />
    </>
  );
}
