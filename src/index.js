// src/index.js - Fully Replicated Application Entry Point

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'; // Assuming this file exists for global styles

// Layout (Note: path changed to match your structure: 'Layout.js' in root src directory)
import Layout from './Layout.js';


// Pages (Note: paths changed to match your structure: 'Pages/...' directory)
import Dashboard from './Pages/Dashboard.js';
import Operators from './Pages/Operators.js';
import Alerts from './Pages/Alerts.js';
import Analytics from './Pages/Analytics.js';
import AIRecommendations from './Pages/AIRecommendations.js';

// 1. Replicating QueryClient with Default Options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// 2. Replicating Layout Wrapper Component
function LayoutWrapper({ children, page }) {
  // This passes the page name prop to the Layout component
  return <Layout currentPageName={page}>{children}</Layout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Note: Paths are case-sensitive to match the original Base44 routing logic */}
          <Route path="/" element={<LayoutWrapper page="Dashboard"><Dashboard /></LayoutWrapper>} />
          <Route path="/Dashboard" element={<LayoutWrapper page="Dashboard"><Dashboard /></LayoutWrapper>} />
          <Route path="/Operators" element={<LayoutWrapper page="Operators"><Operators /></LayoutWrapper>} />
          <Route path="/Alerts" element={<LayoutWrapper page="Alerts"><Alerts /></LayoutWrapper>} />
          <Route path="/Analytics" element={<LayoutWrapper page="Analytics"><Analytics /></LayoutWrapper>} />
          <Route path="/AIRecommendations" element={<LayoutWrapper page="AIRecommendations"><AIRecommendations /></LayoutWrapper>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);