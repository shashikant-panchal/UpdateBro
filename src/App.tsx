import React, { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
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

const StorefrontShell: React.FC = () => {
  const { isReduced } = useMotionConfig();
  useLenis(!isReduced);

  const [showIntro, setShowIntro] = useState(true);
  const [activeView, setActiveView] = useState<'home' | 'category'>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLifestyle, setActiveLifestyle] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [infoTopic, setInfoTopic] = useState<InfoModalTopic>(null);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);

  const handleOpenCategory = (cat: CategoryId) => {
    setActiveCategory(cat);
    setActiveLifestyle(null);
    setActiveView('category');
  };

  const handleBackHome = () => {
    setActiveView('home');
  };

  return (
    <MotionConfig reducedMotion={isReduced ? 'always' : 'user'}>
      <AnimatePresence>
        {showIntro && (
          <IntroVideo onFinished={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-canvas text-ink transition-colors duration-200 pb-20 lg:pb-0">
        <TopMarquee />

        <Navbar
          activeCategory={activeCategory}
          onSelectCategory={handleOpenCategory}
          onGoHome={handleBackHome}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickView={setQuickViewProduct}
        />

        {activeView === 'category' ? (
          <main>
            <CategoryExplorerView
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onBackHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onQuickView={setQuickViewProduct}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </main>
        ) : (
          <main>
            <HeroCarousel onInspectProduct={setQuickViewProduct} />

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
        />

        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
        <CartDrawer />
        <InfoModal topic={infoTopic} onClose={() => setInfoTopic(null)} />

        {/* Mobile View Bottom Navigation Tabs */}
        <MobileBottomNav
          activeView={activeView}
          onGoHome={handleBackHome}
          onOpenCategories={() => handleOpenCategory('all')}
          onOpenPersonalization={() => setIsPersonalizationOpen(true)}
          isPersonalizationOpen={isPersonalizationOpen}
        />

        {/* Personalization Theme Sheet */}
        <PersonalizationModal
          isOpen={isPersonalizationOpen}
          onClose={() => setIsPersonalizationOpen(false)}
        />
      </div>
    </MotionConfig>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <StorefrontShell />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
