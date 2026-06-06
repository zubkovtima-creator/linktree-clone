import { Routes, Route, Navigate } from 'react-router-dom';
import ApiErrorHandler from './components/ApiErrorHandler';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ProfileSettings from './pages/ProfileSettings';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <>
      <ApiErrorHandler />
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfileSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout>
              <Admin />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </>
  );
}

export default App;
