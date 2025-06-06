import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContentWorkflow from './pages/ContentWorkflow';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { AgentProvider } from './context/AgentContext';

function App() {
  return (
    <AgentProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflow" element={<ContentWorkflow />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </AgentProvider>
  );
}

export default App;