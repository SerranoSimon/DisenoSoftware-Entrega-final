export const CAMPAIGNS = [
  { id: "1", name: "Influenza 2026", targetGroup: "Adulto Mayor", status: "active", avance: 45, total: 100 },
  { id: "2", name: "Sars-Cov2 Pediátrica", targetGroup: "Niños 3-11 años", status: "active", avance: 12, total: 50 }
];

export const CENTERS = [
  {
    id: 1, name: "Centro de Vacunación Providencia",
    address: "Av. Providencia 1234, Providencia, Región Metropolitana",
    phone: "+56 2 2345 6789", hours: "Lun–Vie: 08:00–17:00  |  Sáb: 09:00–13:00", status: "open",
    campaigns: [
      { id: 1, name: "Campaña Influenza 2025", vaccines: [{ id: "VAC-FLU-TRI-01", name: "Vacuna Influenza Trivalente", stock: 245 }, { id: "VAC-FLU-TET-01", name: "Vacuna Influenza Tetravalente", stock: 120 }] },
      { id: 2, name: "Campaña COVID-19 Booster", vaccines: [{ id: "VAC-COV-PFZ-01", name: "Pfizer-BioNTech Bivalente", stock: 89 }, { id: "VAC-COV-MOD-01", name: "Moderna Bivalente", stock: 34 }] },
    ],
  },
  {
    id: 2, name: "CESFAM El Bosque",
    address: "Calle El Bosque 456, El Bosque, Región Metropolitana",
    phone: "+56 2 2987 6543", hours: "Lun–Vie: 08:00–16:30", status: "open",
    campaigns: [
      { id: 1, name: "Campaña Influenza 2025", vaccines: [{ id: "VAC-FLU-TRI-01", name: "Vacuna Influenza Trivalente", stock: 0 }, { id: "VAC-FLU-TET-01", name: "Vacuna Influenza Tetravalente", stock: 67 }] },
      { id: 3, name: "Campaña Meningococo", vaccines: [{ id: "VAC-MEN-TET-01", name: "Vacuna Meningocócica Tetravalente", stock: 15 }] },
    ],
  },
  {
    id: 3, name: "Hospital San José",
    address: "Carretera Norte 2000, Independencia, Región Metropolitana",
    phone: "+56 2 2570 1234", hours: "Lun–Vie: 07:30–18:00  |  Sáb: 08:00–12:00", status: "closed",
    campaigns: [
      { id: 2, name: "Campaña COVID-19 Booster", vaccines: [{ id: "VAC-COV-PFZ-01", name: "Pfizer-BioNTech Bivalente", stock: 0 }] },
    ],
  },
  {
    id: 4, name: "Consultorio Las Condes",
    address: "Av. Las Condes 7890, Las Condes, Región Metropolitana",
    phone: "+56 2 2211 9876", hours: "Lun–Vie: 08:00–17:30", status: "open",
    campaigns: [
      { id: 1, name: "Campaña Influenza 2025", vaccines: [{ id: "VAC-FLU-TRI-01", name: "Vacuna Influenza Trivalente", stock: 312 }] },
      { id: 4, name: "Campaña Neumococo", vaccines: [{ id: "VAC-NEU-23V-01", name: "Vacuna Neumocócica 23-valente", stock: 56 }, { id: "VAC-NEU-CON-01", name: "Vacuna Neumocócica Conjugada", stock: 28 }] },
    ],
  },
];

export const APPOINTMENTS = [
  {
    id: "#2025-00841",
    patient: { name: "Ana Martínez López", rut: "12.345.678-9", dob: "15/06/1985", age: 39, phone: "+56 9 1234 5678", address: "Av. Providencia 234, Providencia", prevVaccinations: 3 },
    center: CENTERS[0], campaign: CENTERS[0].campaigns[0], vaccine: CENTERS[0].campaigns[0].vaccines[0],
    date: "2025-07-01", time: "08:45", status: "completed",
  },
  {
    id: "#2025-00842",
    patient: { name: "Pedro Soto Ríos", rut: "10.987.654-3", dob: "22/11/1978", age: 46, phone: "+56 9 8765 4321", address: "Calle Las Flores 567, Maipú", prevVaccinations: 1 },
    center: CENTERS[0], campaign: CENTERS[0].campaigns[1], vaccine: CENTERS[0].campaigns[1].vaccines[0],
    date: "2025-07-01", time: "09:12", status: "completed",
  },
  {
    id: "#2025-00843",
    patient: { name: "Carmen Vidal Torres", rut: "18.765.432-1", dob: "03/03/1990", age: 35, phone: "+56 9 5555 1234", address: "Av. Las Condes 789, Las Condes", prevVaccinations: 2 },
    center: CENTERS[3], campaign: CENTERS[3].campaigns[0], vaccine: CENTERS[3].campaigns[0].vaccines[0],
    date: "2025-07-02", time: "09:38", status: "missed",
  },
  {
    id: "#2025-00844",
    patient: { name: "Roberto Castro Pino", rut: "15.678.901-2", dob: "10/08/1965", age: 59, phone: "+56 9 9876 5432", address: "Pasaje El Roble 12, El Bosque", prevVaccinations: 4 },
    center: CENTERS[1], campaign: CENTERS[1].campaigns[1], vaccine: CENTERS[1].campaigns[1].vaccines[0],
    date: "2025-07-03", time: "10:05", status: "scheduled",
  },
  {
    id: "#2025-00845",
    patient: { name: "Lucía Henríquez Mora", rut: "13.456.789-0", dob: "28/01/1992", age: 33, phone: "+56 9 1111 2222", address: "Av. Grecia 456, Ñuñoa", prevVaccinations: 0 },
    center: CENTERS[0], campaign: CENTERS[0].campaigns[0], vaccine: CENTERS[0].campaigns[0].vaccines[1],
    date: "2025-07-03", time: "10:30", status: "scheduled",
  },
  {
    id: "#2025-00846",
    patient: { name: "Diego Fuentes Araya", rut: "17.234.567-8", dob: "14/09/1988", age: 36, phone: "+56 9 3333 4444", address: "Calle Mapocho 890, Quinta Normal", prevVaccinations: 1 },
    center: CENTERS[3], campaign: CENTERS[3].campaigns[1], vaccine: CENTERS[3].campaigns[1].vaccines[0],
    date: "2025-07-04", time: "11:00", status: "scheduled",
  },
  {
    id: "#2025-00847",
    patient: { name: "Juan Carlos Morales Vega", rut: "15.234.789-K", dob: "12/03/1978", age: 47, phone: "+56 9 8765 4321", address: "Av. Grecia 1456, Dpto. 23, Ñuñoa", prevVaccinations: 2 },
    center: CENTERS[0], campaign: CENTERS[0].campaigns[0], vaccine: CENTERS[0].campaigns[0].vaccines[0],
    date: "2025-07-03", time: "14:00", status: "scheduled",
  },
];

export const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export function campaignsWithStock(center) {
  return center.campaigns
    .map((c) => ({ ...c, vaccines: c.vaccines.filter((v) => v.stock > 0) }))
    .filter((c) => c.vaccines.length > 0);
}

export function fmtDate(iso) {
  return iso ? new Date(iso + "T00:00").toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—";
}

export function fmtDateShort(iso) {
  return iso ? new Date(iso + "T00:00").toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" }) : "—";
}

export function initials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}