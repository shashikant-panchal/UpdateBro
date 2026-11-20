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
import { UnderDevelopmentPopup } from './components/UnderDevelopmentPopup';
import { AuthModal } from './components/AuthModal';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { NewArrivalsWidget } from './components/NewArrivalsWidget';
import { StorefrontProvider, useStorefront } from './context/StorefrontContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export type AppView = 'home' | 'category' | 'orders';

const StorefrontShell: React.FC = () => {
  const { isReduced } = useMotionConfig();
  useLenis(!isReduced);

  // Dynamic Storefront Sync
  const { storeSettings } = useStorefront();

  // Route State derived from URL
  const [activeView, setActiveView] = useState<AppView>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/orders')) return 'orders';
    if (path.startsWith('/category')) return 'category';
    return 'home';
  });

  const [showIntro, setShowIntro] = useState(() => {
    // Only show video on initial home landing, skip if directly navigating to /orders
    if (window.location.pathname.startsWith('/orders')) return false;
    try {
      if (sessionStorage.getItem('ub_intro_played') === 'true') {
        return false;
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLifestyle, setActiveLifestyle] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [infoTopic, setInfoTopic] = useState<InfoModalTopic>(null);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [showDevPopup, setShowDevPopup] = useState(false);

  // Synchronize browser history and popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p.startsWith('/orders')) {
        setActiveView('orders');
      } else if (p.startsWith('/category')) {
        setActiveView('category');
      } else {
        setActiveView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!showIntro) {
      setShowDevPopup(true);
    }
  }, [showIntro]);

  const navigateTo = (view: AppView, cat?: CategoryId) => {
    setActiveView(view);
    let targetPath = '/';
    if (view === 'orders') targetPath = '/orders';
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
      {/* Intro Video */}
      <AnimatePresence>
        {showIntro && (
          <IntroVideo
            onFinished={() => {
              try {
                sessionStorage.setItem('ub_intro_played', 'true');
              } catch {
                // ignore
              }
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* VIEW 1: Customer Live Order Tracker */}
      {activeView === 'orders' ? (
        <div className="min-h-screen bg-canvas text-ink transition-colors duration-200">
          <TopMarquee announcementText={storeSettings?.announcement_text} />
          <Navbar
            activeCategory={activeCategory}
            onSelectCategory={handleOpenCategory}
            onGoHome={handleBackHome}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickView={setQuickViewProduct}
            onOpenOrders={() => navigateTo('orders')}
          />
          <main>
            <CustomerOrdersView onBack={handleBackHome} />
          </main>
          <Footer
            onSelectCategory={handleOpenCategory}
            onOpenInfo={setInfoTopic}
            onOpenOrders={() => navigateTo('orders')}
          />
        </div>
      ) : (
        /* VIEW 2: Flagship Storefront Shell (Home / Category Explorer) */
        <div className="min-h-screen bg-canvas text-ink transition-colors duration-200 pb-20 lg:pb-0">
          <TopMarquee announcementText={storeSettings?.announcement_text} />

          <Navbar
            activeCategory={activeCategory}
            onSelectCategory={handleOpenCategory}
            onGoHome={handleBackHome}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickView={setQuickViewProduct}
            onOpenOrders={() => navigateTo('orders')}
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
            onReplayIntro={() => setShowIntro(true)}
            onOpenOrders={() => navigateTo('orders')}
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
      <CartDrawer onOpenOrders={() => navigateTo('orders')} />

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

      <UnderDevelopmentPopup
        isOpen={!showIntro && showDevPopup}
        onClose={() => setShowDevPopup(false)}
        durationMs={4000}
      />
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
