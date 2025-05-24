import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from "./components/pages/Landing"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"
import Dashboard from "./components/pages/Dashboard"
import AuthProvider from "./components/AuthProvider"
import ProtectedRoute from "./components/ProtectedRoute"
import { ROUTES } from './routes'
import { debugAuth } from './utils/authDebug'

function App() {
  useEffect(() => {
    // Start monitoring localStorage changes for debugging
    debugAuth.startLocalStorageMonitoring();

    return () => {
      debugAuth.stopLocalStorageMonitoring();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
