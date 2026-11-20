import React from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  activeView: 'home' | 'category' | 'orders' | 'profile' | string;
  onGoHome: () => void;
  onOpenCategories: () => void;
  onOpenProfile: () => void;
  onOpenPersonalization?: () => void;
  isPersonalizationOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onGoHome,
  onOpenCategories,
  onOpenProfile,
}) => {
  const { itemCount, isCartOpen, setIsCartOpen, lastAddedTick } = useCart();
  const { user, profile } = useAuth();

  const isHomeActive = activeView === 'home' && !isCartOpen;
  const isCategoryActive = activeView === 'category' && !isCartOpen;
  const isCartActive = isCartOpen;
  const isProfileActive = (activeView === 'profile' || activeView === 'orders') && !isCartOpen;

  const handleHomeClick = () => {
    if (isCartOpen) setIsCartOpen(false);
    if (activeView !== 'home') {
      onGoHome();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    if (isCartOpen) setIsCartOpen(false);
    onOpenCategories();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleProfileClick = () => {
    if (isCartOpen) setIsCartOpen(false);
    onOpenProfile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isActive: isHomeActive,
      onClick: handleHomeClick,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      isActive: isCategoryActive,
      onClick: handleCategoriesClick,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      isActive: isCartActive,
      onClick: handleCartClick,
      badge: itemCount > 0 ? (itemCount > 99 ? '99+' : itemCount) : null,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      isActive: isProfileActive,
      onClick: handleProfileClick,
      userAvatar: user ? (profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U') : null,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 backdrop-blur-xl transition-colors duration-200 lg:hidden shadow-[0_-6px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-6px_24px_rgba(0,0,0,0.45)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`group relative flex h-full flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
                item.isActive ? 'text-accent' : 'text-muted hover:text-ink'
              }`}
              aria-label={item.label}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {/* Icon Container with Badge */}
              <div className="relative">
                {item.id === 'profile' && item.userAvatar ? (
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-transform group-hover:scale-110 ${
                      item.isActive
                        ? 'bg-accent text-white shadow-glow'
                        : 'bg-cloud text-ink border border-line'
                    }`}
                  >
                    {item.userAvatar}
                  </div>
                ) : (
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                      item.isActive ? 'stroke-[2.5px]' : 'stroke-2'
                    }`}
                  />
                )}

                {/* Cart Count Badge */}
                {item.badge !== null && item.badge !== undefined && (
                  <motion.span
                    key={`${item.badge}-${lastAddedTick}`}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-black text-accent-ink shadow-sm"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight transition-colors ${
                  item.isActive ? 'font-extrabold text-ink' : 'font-semibold text-muted'
                }`}
              >
                {item.label}
              </span>

              {/* Active Tab Indicator Glow Bar */}
              {item.isActive && (
                <motion.div
                  layoutId="mobileBottomNavActiveIndicator"
                  className="absolute bottom-1 h-0.5 w-5 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
