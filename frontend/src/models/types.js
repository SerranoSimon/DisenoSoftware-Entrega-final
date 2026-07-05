type Vaccine = { id: string; name: string; stock: number };
type Campaign = { id: number; name: string; vaccines: Vaccine[] };
type Center = { id: number; name: string; address: string; phone: string; hours: string; status: "open" | "closed"; campaigns: Campaign[] };
type ApptStatus = "scheduled" | "completed" | "missed";
type Patient = { name: string; rut: string; dob: string; age: number; phone: string; address: string; prevVaccinations: number };
type Appointment = { id: string; patient: Patient; center: Center; campaign: Campaign; vaccine: Vaccine; date: string; time: string; status: ApptStatus };
type Screen = "dashboard" | "centers" | "appointment" | "misCitas" | "detalleCita" | "vaccination";
