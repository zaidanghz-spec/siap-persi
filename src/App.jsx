import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppStoreProvider } from './store/AppStore';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import HospitalLayout from './components/HospitalLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import RankingPage from './pages/public/RankingPage';
import HospitalDetailPage from './pages/public/HospitalDetailPage';
import MethodologyPage from './pages/MethodologyPage';
import NewsPage from './pages/public/NewsPage';
import EventsPage from './pages/public/EventsPage';

// Auth
import LoginPage from './pages/LoginPage';

// Hospital Portal
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalProfileForm from './pages/hospital/HospitalProfileForm';
import PatientSurveyManager from './pages/hospital/PatientSurveyManager';
import DataEntryPage from './pages/DataEntryPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ReviewDetail from './pages/admin/ReviewDetail';
import ConfigPage from './pages/admin/ConfigPage';
import AccountManagement from './pages/admin/AccountManagement';
import NewsManager from './pages/admin/NewsManager';
import EventsManager from './pages/admin/EventsManager';

// Public Survey
import PatientSurvey from './pages/public/PatientSurvey';

function App() {
  return (
    <AppStoreProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/ranking/:id" element={<HospitalDetailPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/survey/:token" element={<PatientSurvey />} />

            {/* Auth */}
            <Route path="/portal/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Hospital Portal */}
            <Route path="/portal" element={<ProtectedRoute requiredRole="hospital"><HospitalLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<HospitalDashboard />} />
              <Route path="profile" element={<HospitalProfileForm />} />
              <Route path="surveys" element={<PatientSurveyManager />} />
              <Route path="data-entry" element={<DataEntryPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="review/:id" element={<ReviewDetail />} />
              <Route path="config" element={<ConfigPage />} />
              <Route path="accounts" element={<AccountManagement />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="events" element={<EventsManager />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppStoreProvider>
  );
}

export default App;
