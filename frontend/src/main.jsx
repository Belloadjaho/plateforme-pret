import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PublicLayout from './components/PublicLayout.jsx'
import PrivateLayout from './components/PrivateLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CommentCaMarche from './pages/CommentCaMarche.jsx'
import ObtenirPret from './pages/ObtenirPret.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NouvelleDemande from './pages/NouvelleDemande.jsx'
import Echeancier from './pages/Echeancier.jsx'
import MonContrat from './pages/MonContrat.jsx'
import Profil from './pages/Profil.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminDemandes from './pages/AdminDemandes.jsx'
import DetailDemande from './pages/DetailDemande.jsx'
import AdminHistorique from './pages/AdminHistorique.jsx'
import AdminParametres from './pages/AdminParametres.jsx'
import AdminOffres from './pages/AdminOffres.jsx'

import './index.css'

// 👇 LE VIDEUR POUR LES EMPRUNTEURS
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 👇 LE VIDEUR POUR L'ADMIN
// eslint-disable-next-line react-refresh/only-export-components
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/comment-ca-marche" element={<PublicLayout><CommentCaMarche /></PublicLayout>} />
        <Route path="/obtenir-pret" element={<PublicLayout><ObtenirPret /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVÉ (Connecté) */}
        <Route path="/dashboard" element={<ProtectedRoute><PrivateLayout><Dashboard /></PrivateLayout></ProtectedRoute>} />
        <Route path="/nouvelle-demande" element={<ProtectedRoute><PrivateLayout><NouvelleDemande /></PrivateLayout></ProtectedRoute>} />
        <Route path="/echeancier" element={<ProtectedRoute><PrivateLayout><Echeancier /></PrivateLayout></ProtectedRoute>} />
        <Route path="/mon-contrat" element={<ProtectedRoute><PrivateLayout><MonContrat /></PrivateLayout></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><PrivateLayout><Profil /></PrivateLayout></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/demandes" element={<AdminRoute><AdminLayout><AdminDemandes /></AdminLayout></AdminRoute>} />
        <Route path="/admin/demandes/:id" element={<AdminRoute><AdminLayout><DetailDemande /></AdminLayout></AdminRoute>} />
        <Route path="/admin/historique" element={<AdminRoute><AdminLayout><AdminHistorique /></AdminLayout></AdminRoute>} />
        <Route path="/admin/parametres" element={<AdminRoute><AdminLayout><AdminParametres /></AdminLayout></AdminRoute>} />
        <Route path="/admin/offres" element={<AdminRoute><AdminLayout><AdminOffres /></AdminLayout></AdminRoute>} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)