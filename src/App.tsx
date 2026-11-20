import React, { useState, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useMotionConfig } from './hooks/useMotionConfig';
import { useLenis } from './hooks/useLenis';
import type { CategoryId, Product } from './types';
import { TopMarquee } from './components/TopMarquee';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryStrip } from './components/CategoryStrip';
import { CategoryExplorerView } from './components/CategoryExplorerView';
import { FlashDeals } from './components/FlashDeals';
import { ProductGrid } from './components/ProductGrid';
import { LifestyleBento } from './components/LifestyleBento';
import { CombosSection } from './components/CombosSection';
import { TrustStrip } from './components/TrustStrip';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { InfoModal, type InfoModalTopic } from './components/InfoModal';
import { IntroVideo } from './components/IntroVideo';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PersonalizationModal } from './components/PersonalizationModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileView, type ProfileTab } from './components/UserProfileView';
import { NewArrivalsWidget } from './components/NewArrivalsWidget';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsOfServiceView } from './components/TermsOfServiceView';
import { StorefrontProvider, useStorefront } from './context/StorefrontContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export type AppView = 'home' | 'category' | 'orders' | 'profile' | 'privacy' | 'terms';

const StorefrontShell: React.FC = () => {
  const { isReduced } = useMotionConfig();
  useLenis(!isReduced);

  // Dynamic Storefront Sync
  const { storeSettings } = useStorefront();

  // Route State derived from URL (Supports /privacy-policy, /terms-of-service, /orders, /profile, /category)
  const [activeView, setActiveView] = useState<AppView>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/privacy')) return 'privacy';
    if (path.startsWith('/terms')) return 'terms';
    if (path.startsWith('/orders')) return 'orders';
    if (path.startsWith('/profile') || path.startsWith('/account')) return 'profile';
    if (path.startsWith('/category') || path.startsWith('/categories')) return 'category';
    return 'home';
  });

  const [profileInitialTab, setProfileInitialTab] = useState<ProfileTab>('details');

  const [showIntro, setShowIntro] = useState(() => {
    // Clean up any legacy single-play session storage flag
    try {
      sessionStorage.removeItem('ub_intro_played');
    } catch {
      // ignore
    }

    const path = window.location.pathname.toLowerCase();
    // Skip only when directly landing on external legal docs for OAuth review
    if (path.startsWith('/privacy') || path.startsWith('/terms')) {
      return false;
    }
    // Plays every time the website loads or reloads
    return true;
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLifestyle, setActiveLifestyle] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [infoTopic, setInfoTopic] = useState<InfoModalTopic>(null);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);

  // Synchronize browser history and popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith('/privacy')) {
        setActiveView('privacy');
      } else if (p.startsWith('/terms')) {
        setActiveView('terms');
      } else if (p.startsWith('/orders')) {
        setActiveView('orders');
      } else if (p.startsWith('/profile') || p.startsWith('/account')) {
        setActiveView('profile');
      } else if (p.startsWith('/category') || p.startsWith('/categories')) {
        setActiveView('category');
      } else {
        setActiveView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: AppView, cat?: CategoryId) => {
    setActiveView(view);
    let targetPath = '/';
    if (view === 'orders') targetPath = '/orders';
    else if (view === 'profile') targetPath = '/profile';
    else if (view === 'privacy') targetPath = '/privacy-policy';
    else if (view === 'terms') targetPath = '/terms-of-service';
    else if (view === 'category') {
      targetPath = cat && cat !== 'all' ? `/category/${cat}` : '/categories';
      if (cat) setActiveCategory(cat);
      setActiveLifestyle(null);
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategory = (cat: CategoryId) => {
    navigateTo('category', cat);
  };

  const handleBackHome = () => {
    navigateTo('home');
  };

  return (
    <MotionConfig reducedMotion={isReduced ? 'always' : 'user'}>
      {/* 2-Second Brand Intro Animation (Plays each time website reloads) */}
      <AnimatePresence>
        {showIntro && (
          <IntroVideo
            onFinished={() => {
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* VIEW 1: Dedicated Legal Views (Required for Google OAuth Verification) */}
      {activeView === 'privacy' ? (
        <PrivacyPolicyView
          onBack={handleBackHome}
          onOpenTerms={() => navigateTo('terms')}
        />
      ) : activeView === 'terms' ? (
        <TermsOfServiceView
          onBack={handleBackHome}
          onOpenPrivacy={() => navigateTo('privacy')}
        />
      ) : activeView === 'orders' || activeView === 'profile' ? (
        <div className="min-h-screen bg-canvas text-ink transition-colors duration-200">
          <TopMarquee announcementText={storeSettings?.announcement_text} />
          <Navbar
            activeCategory={activeCategory}
            onSelectCategory={handleOpenCategory}
            onGoHome={handleBackHome}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickView={setQuickViewProduct}
            onOpenOrders={() => {
              setProfileInitialTab('orders');
              navigateTo('orders');
            }}
            onOpenProfile={(tab) => {
              setProfileInitialTab(tab || 'details');
              navigateTo('profile');
            }}
          />
          <main>
            <UserProfileView
              onBack={handleBackHome}
              initialTab={activeView === 'orders' ? 'orders' : profileInitialTab}
              onGoHome={handleBackHome}
            />
          </main>
          <Footer
            onSelectCategory={handleOpenCategory}
            onOpenInfo={setInfoTopic}
            onOpenOrders={() => {
              setProfileInitialTab('orders');
              navigateTo('orders');
            }}
            onOpenPrivacy={() => navigateTo('privacy')}
            onOpenTerms={() => navigateTo('terms')}
          />
        </div>
      ) : (
        /* VIEW 3: Flagship Storefront Shell (Home / Category Explorer) */
        <div className="min-h-screen bg-canvas text-ink transition-colors duration-200 pb-20 lg:pb-0">
          <TopMarquee announcementText={storeSettings?.announcement_text} />

          <Navbar
            activeCategory={activeCategory}
            onSelectCategory={handleOpenCategory}
            onGoHome={handleBackHome}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickView={setQuickViewProduct}
            onOpenOrders={() => {
              setProfileInitialTab('orders');
              navigateTo('orders');
            }}
            onOpenProfile={(tab) => {
              setProfileInitialTab(tab || 'details');
              navigateTo('profile');
            }}
          />

          {activeView === 'category' ? (
            <main>
              <CategoryExplorerView
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                onBackHome={handleBackHome}
                onQuickView={setQuickViewProduct}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </main>
          ) : (
            <main>
              <ErrorBoundary fallbackTitle="Hero banner is temporarily loading">
                <HeroCarousel onInspectProduct={setQuickViewProduct} />
              </ErrorBoundary>

              <CategoryStrip
                activeCategory={activeCategory}
                onSelectCategory={handleOpenCategory}
              />

              <LifestyleBento
                onSelectLifestyle={(tag) => {
                  setActiveCategory('all');
                  setActiveLifestyle(tag);
                }}
              />

              <FlashDeals onQuickView={setQuickViewProduct} />

              <NewArrivalsWidget onQuickView={setQuickViewProduct} />

              <ProductGrid
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                activeLifestyle={activeLifestyle}
                onClearLifestyle={() => setActiveLifestyle(null)}
                onQuickView={setQuickViewProduct}
              />

              <CombosSection onQuickView={setQuickViewProduct} />

              <TrustStrip />
            </main>
          )}

          <Footer
            onSelectCategory={handleOpenCategory}
            onOpenInfo={setInfoTopic}
            onOpenOrders={() => {
              setProfileInitialTab('orders');
              navigateTo('orders');
            }}
            onOpenPrivacy={() => navigateTo('privacy')}
            onOpenTerms={() => navigateTo('terms')}
          />

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav
            activeView={activeView === 'category' ? 'category' : 'home'}
            onGoHome={handleBackHome}
            onOpenCategories={() => handleOpenCategory('all')}
            onOpenPersonalization={() => setIsPersonalizationOpen(true)}
            isPersonalizationOpen={isPersonalizationOpen}
          />
        </div>
      )}

      {/* Global Drawers & Modals (Single Instance Mounted at Root) */}
      <CartDrawer
        onOpenOrders={() => {
          setProfileInitialTab('orders');
          navigateTo('orders');
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <InfoModal topic={infoTopic} onClose={() => setInfoTopic(null)} />

      <PersonalizationModal
        isOpen={isPersonalizationOpen}
        onClose={() => setIsPersonalizationOpen(false)}
      />

      <AuthModal />
    </MotionConfig>
  );
};

export function App() {
  return (
    <ErrorBoundary fallbackTitle="Storefront is experiencing a temporary issue">
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <StorefrontProvider>
              <StorefrontShell />
            </StorefrontProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
