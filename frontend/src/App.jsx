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
import { Toast } from './components/Toast';
import { logout as doLogout } from './api/authService';
import { getMe as getPacienteMe } from './api/pacienteService';
import { getMe as getFuncionarioMe } from './api/funcSaludService';

export default function App() {
  const [rol, setRol] = useState(() => sessionStorage.getItem('rol'));
  const [screen, setScreen] = useState('dashboard');
  const [selectedCitaId, setSelectedCitaId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [userPreference, setUserPreference] = useState("");

  // El interceptor de axios dispara 'auth:logout' ante un 401 -> volvemos al login.
  useEffect(() => {
    const onLogout = () => { setRol(null); setUserName(""); setUserEmail(""); };
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  // Nombre y correo del usuario logueado para el sidebar, la barra superior y el pop-up.
  // Paciente: GET /pacientes/me. Funcionario: GET /funcionarios/me.
  useEffect(() => {
    if (!rol) { 
      setUserName(""); 
      setUserEmail(""); 
      setUserPhone(""); 
      setUserPreference(""); 
      return; 
    }
    let activo = true;
    (async () => {
      try {
        const me = rol === 'PACIENTE' ? await getPacienteMe() : await getFuncionarioMe();
        if (activo) {
          console.log("Respuesta cruda de la API:", me);
          setUserName(`${me.nombres} ${me.apellidos}`.trim());
          setUserEmail(me.correoElectronico || "");
          
          // Agregamos los datos del DTO asegurando el manejo de nulos
          setUserPhone(me.fono || ""); 
          setUserPreference(me.preferencia || "");
        }
      } catch {
        // Si falla, se mantiene el rótulo genérico por rol.
      }
    })();
    return () => { activo = false; };
  }, [rol]);

  const handleLogin = (loginRol) => {
    setRol(loginRol);
    setScreen(loginRol === 'FUNCIONARIO' ? 'atender' : 'dashboard');
  };

  const handleLogout = () => {
    doLogout();
    setRol(null);
    setScreen('dashboard');
    setUserEmail("");
    setToastOpen(false);
  };

  // Muestra el aviso de "correo enviado" (al confirmar cita o vacunación).
  const showEmailToast = () => {
    setToastOpen(false);
    // reinicia el temporizador si ya estaba visible
    requestAnimationFrame(() => setToastOpen(true));
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
      <Toast 
  open={toastOpen} 
  email={userEmail} 
  phone={userPhone}            
  preference={userPreference}   
  onClose={() => setToastOpen(false)} 
/>
      <Sidebar rol={rol} userName={userName} active={screen} setScreen={setScreen} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar rol={rol} userName={userName} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* --- Paciente --- */}
          {!isFuncionario && screen === 'dashboard' && (
            <DashboardScreen setScreen={setScreen} onViewDetail={viewDetail} />
          )}
          {!isFuncionario && screen === 'appointment' && (
            <AppointmentScreen onFinished={() => setScreen('misCitas')} onEmailSent={showEmailToast} />
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
              onEmailSent={showEmailToast}
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
