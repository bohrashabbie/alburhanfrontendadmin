import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SiteSettings from './pages/SiteSettings';
import NavigationItems from './pages/NavigationItems';
import CarouselSlides from './pages/CarouselSlides';
import PageContents from './pages/PageContents';
import Services from './pages/Services';
import Sectors from './pages/Sectors';
import TeamMembers from './pages/TeamMembers';
import Countries from './pages/Countries';
import Branches from './pages/Branches';
import ContactInfo from './pages/ContactInfo';
import Brands from './pages/Brands';
import Products from './pages/Products';
import Banners from './pages/Banners';
import ProjectCategories from './pages/ProjectCategories';
import Projects from './pages/Projects';
import SocialLinks from './pages/SocialLinks';
import FooterLinks from './pages/FooterLinks';
import StaticPages from './pages/StaticPages';
import ContactSubmissions from './pages/ContactSubmissions';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/site-settings" element={<SiteSettings />} />
        <Route path="/navigation" element={<NavigationItems />} />
        <Route path="/carousel" element={<CarouselSlides />} />
        <Route path="/page-contents" element={<PageContents />} />
        <Route path="/services" element={<Services />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/contact-info" element={<ContactInfo />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/products" element={<Products />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/project-categories" element={<ProjectCategories />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/social-links" element={<SocialLinks />} />
        <Route path="/footer-links" element={<FooterLinks />} />
        <Route path="/static-pages" element={<StaticPages />} />
        <Route path="/contact-submissions" element={<ContactSubmissions />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
