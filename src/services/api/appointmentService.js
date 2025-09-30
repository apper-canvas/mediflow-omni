import appointmentsData from "@/services/mockData/appointments.json";

let appointments = [...appointmentsData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find((a) => a.Id === parseInt(id));
    if (!appointment) throw new Error("Appointment not found");
    return { ...appointment };
  },

  async getByPatientId(patientId) {
    await delay(250);
    return appointments.filter((a) => a.patientId === patientId.toString());
  },

  async getByDate(date) {
    await delay(250);
    return appointments.filter((a) => a.date === date);
  },

  async getTodayAppointments() {
    await delay(300);
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter((a) => a.date === today);
  },

  async create(appointmentData) {
    await delay(400);
    const maxId = appointments.reduce((max, a) => Math.max(max, a.Id), 0);
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      status: "Scheduled",
      createdAt: new Date().toISOString().split("T")[0]
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, appointmentData) {
    await delay(350);
    const index = appointments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Appointment not found");
    appointments[index] = { ...appointments[index], ...appointmentData };
    return { ...appointments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = appointments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Appointment not found");
    appointments.splice(index, 1);
    return { success: true };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = appointments.findIndex((a) => a.Id === parseInt(id));
    if (index === -1) throw new Error("Appointment not found");
    appointments[index].status = status;
    return { ...appointments[index] };
  }
};