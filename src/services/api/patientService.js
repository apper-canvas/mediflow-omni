import patientsData from "@/services/mockData/patients.json";

let patients = [...patientsData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const patientService = {
  async getAll() {
    await delay(300);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find((p) => p.Id === parseInt(id));
    if (!patient) throw new Error("Patient not found");
    return { ...patient };
  },

  async create(patientData) {
    await delay(400);
    const maxId = patients.reduce((max, p) => Math.max(max, p.Id), 0);
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, patientData) {
    await delay(350);
    const index = patients.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) throw new Error("Patient not found");
    patients[index] = { ...patients[index], ...patientData };
    return { ...patients[index] };
  },

  async delete(id) {
    await delay(300);
    const index = patients.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) throw new Error("Patient not found");
    patients.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(lowerQuery) ||
        p.lastName.toLowerCase().includes(lowerQuery) ||
        p.Id.toString().includes(lowerQuery) ||
        p.phone.includes(query)
    );
  }
};