import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { Layout } from './Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { JugadoresPage } from '../pages/JugadoresPage';
import { PartidosPage } from '../pages/PartidosPage';
import { PartidoDetailPage } from '../pages/PartidoDetailPage';
import { StatsPage } from '../pages/StatsPage';

export const App: React.FC = () => (
  <AppProviders>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/jugadores" element={<JugadoresPage />} />
        <Route path="/partidos" element={<PartidosPage />} />
        <Route path="/partidos/:id" element={<PartidoDetailPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Route>
    </Routes>
  </AppProviders>
);
