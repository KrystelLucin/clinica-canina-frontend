import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Duenos from './pages/Duenos';
import DuenoForm from './pages/DuenoForm';
import Mascotas from './pages/Mascotas';
import MascotaForm from './pages/MascotaForm';
import Citas from './pages/Citas';
import CitaForm from './pages/CitaForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Home />} />
            <Route path="duenos" element={<Duenos />} />
            <Route path="duenos/new" element={<DuenoForm />} />
            <Route path="duenos/edit/:id" element={<DuenoForm />} />
            
            <Route path="mascotas" element={<Mascotas />} />
            <Route path="mascotas/new" element={<MascotaForm />} />
            <Route path="mascotas/edit/:id" element={<MascotaForm />} />
          
            <Route path="citas" element={<Citas />} />
            <Route path="citas/new" element={<CitaForm />} />
            <Route path="citas/edit/:id" element={<CitaForm />} />

          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
