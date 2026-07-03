import React, { useState } from 'react';
// Layout
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
// Pages
import { DashboardScreen } from './pages/DashboardScreen';
import { LoginScreen } from './pages/LoginScreen';
import { CentersScreen } from './pages/CentersScreen';
import { AppointmentScreen } from './pages/AppointmentScreen';
import { MisCitasScreen } from './pages/MisCitasScreen';
import { DetalleCitaScreen } from './pages/DetallesCitaScreen';
import { VaccinationScreen } from './pages/VaccinationScreen';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  // Función para manejar la navegación desde los detalles
  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setScreen("detalleCita");
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F5F7FA", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar active={screen} setScreen={setScreen} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          {screen === "dashboard" && <DashboardScreen setScreen={setScreen} />}
          {screen === "centers" && <CentersScreen setScreen={setScreen} />}
          {screen === "appointment" && <AppointmentScreen />}
          {screen === "misCitas" && <MisCitasScreen onViewDetail={handleViewDetail} />}
          {screen === "detalleCita" && (
            <DetalleCitaScreen
              appointment={selectedAppointment}
              onBack={() => setScreen("misCitas")}
            />
          )}
          {screen === "vaccination" && (
            <VaccinationScreen
              appointment={selectedAppointment}
              onBack={() => setScreen("detalleCita")}
            />
          )}
        </main>
      </div>
    </div>
  );
}