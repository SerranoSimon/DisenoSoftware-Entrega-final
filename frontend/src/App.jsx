import React, { useState, useEffect } from 'react';
// Layout
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
// Pages
import { DashboardScreen } from './pages/DashboardScreen';
import { LoginScreen } from './pages/LoginScreen';
import { AppointmentScreen } from './pages/AppointmentScreen';
import { CitasListScreen } from './pages/MisCitasScreen';
import { DetalleCitaScreen } from './pages/DetallesCitaScreen';
import { VaccinationScreen } from './pages/VaccinationScreen';
import { logout as doLogout } from './api/authService';

export default function App() {
  const [rol, setRol] = useState(() => sessionStorage.getItem('rol'));
  const [screen, setScreen] = useState('dashboard');
  const [selectedCitaId, setSelectedCitaId] = useState(null);

  // El interceptor de axios dispara 'auth:logout' ante un 401 -> volvemos al login.
  useEffect(() => {
    const onLogout = () => setRol(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const handleLogin = (loginRol) => {
    setRol(loginRol);
    setScreen(loginRol === 'FUNCIONARIO' ? 'atender' : 'dashboard');
  };

  const handleLogout = () => {
    doLogout();
    setRol(null);
    setScreen('dashboard');
  };

  if (!rol) return <LoginScreen onLogin={handleLogin} />;

  const isFuncionario = rol === 'FUNCIONARIO';

  const viewDetail = (id) => {
    setSelectedCitaId(id);
    setScreen('detalleCita');
  };
  const backToList = () => setScreen(isFuncionario ? 'atender' : 'misCitas');

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F5F7FA", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar rol={rol} active={screen} setScreen={setScreen} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar rol={rol} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* --- Paciente --- */}
          {!isFuncionario && screen === 'dashboard' && (
            <DashboardScreen setScreen={setScreen} onViewDetail={viewDetail} />
          )}
          {!isFuncionario && screen === 'appointment' && (
            <AppointmentScreen onFinished={() => setScreen('misCitas')} />
          )}
          {!isFuncionario && screen === 'misCitas' && (
            <CitasListScreen mode="mias" onViewDetail={viewDetail} />
          )}

          {/* --- Funcionario --- */}
          {isFuncionario && screen === 'atender' && (
            <CitasListScreen mode="atender" onViewDetail={viewDetail} />
          )}
          {isFuncionario && screen === 'vaccination' && (
            <VaccinationScreen
              citaId={selectedCitaId}
              onBack={() => setScreen('detalleCita')}
              onDone={() => setScreen('detalleCita')}
            />
          )}

          {/* --- Común: detalle de una cita --- */}
          {screen === 'detalleCita' && (
            <DetalleCitaScreen
              citaId={selectedCitaId}
              rol={rol}
              onBack={backToList}
              onRegisterVaccination={() => setScreen('vaccination')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
