import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from "./components/pages/Landing"
import Login from "./components/pages/Login"
import Dashboard from "./components/pages/Dashboard"
import { ROUTES } from './routes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
