import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from '../ui/Toast';

export const Layout = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main
        className={`flex-1 ${
          fullWidth ? 'w-full' : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'
        }`}
      >
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
