import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Duenos from './pages/Duenos';


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
            {/*<Route path="duenos/new" element={<DuenoForm />} />
            <Route path="duenos/edit/:id" element={<DuenoForm />} />
            <Route path="duenos/:id" element={<DuenoDetail />} />

            <Route path="mascotas" element={<MascotasList />} />
            <Route path="mascotas/new" element={<MascotaForm />} />
            <Route path="mascotas/edit/:id" element={<MascotaForm />} />
            <Route path="mascotas/:id" element={<MascotaDetail />} />

            <Route path="citas" element={<CalendarioCitas />} />
            <Route path="citas/new" element={<CitaForm />} />
            <Route path="citas/edit/:id" element={<CitaForm />} />*/}

          </Route>

          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
