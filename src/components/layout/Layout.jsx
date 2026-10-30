import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import GlobalSearchModal from '../common/GlobalSearchModal';
import QuickActionModal from '../common/QuickActionModal';
import PrivacyLockModal from '../common/PrivacyLockModal';
import { useApp } from '../../context/AppContext';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 768);
  const { setSearchModalOpen, lockScreen, settings } = useApp();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileScreen(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K shortcut for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      // Ctrl/Cmd + Shift + L to lock screen instantly
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        if (settings?.privacyPin) {
          e.preventDefault();
          lockScreen();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSearchModalOpen]);

  const marginLeft = isMobileScreen
    ? 0
    : isCollapsed
    ? 'var(--sidebar-width-collapsed)'
    : 'var(--sidebar-width)';

  return (
    <div className="app-container">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div
        className="main-wrapper"
        style={{
          marginLeft,
          transition: 'margin-left var(--transition-normal)',
          width: isMobileScreen ? '100%' : `calc(100% - ${marginLeft})`,
        }}
      >
        <Navbar isCollapsed={isCollapsed} setIsMobileOpen={setIsMobileOpen} />

        <main className="page-container">
          <Outlet />
        </main>

        <MobileNav onOpenSidebar={() => setIsMobileOpen(true)} />
      </div>

      <GlobalSearchModal />
      <QuickActionModal />
      <PrivacyLockModal />
    </div>
  );
};

export default Layout;
