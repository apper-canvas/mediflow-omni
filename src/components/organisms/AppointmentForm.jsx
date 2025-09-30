import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";

const AppointmentForm = ({ appointment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    departmentId: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  const loadDropdownData = async () => {
    try {
      const [patientsData, doctorsData, departmentsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Patient"
          name="patientId"
          as="select"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.Id} value={patient.Id}>
              {patient.firstName} {patient.lastName} - #{patient.Id}
            </option>
          ))}
        </FormField>

        <FormField
          label="Department"
          name="departmentId"
          as="select"
          value={formData.departmentId}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.Id} value={dept.Id}>
              {dept.name}
            </option>
          ))}
        </FormField>

        <FormField
          label="Doctor"
          name="doctorId"
          as="select"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.Id} value={doctor.Id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </FormField>

        <FormField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <FormField
          label="Time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>

      <FormField
        label="Reason for Visit"
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        required
      />

      <FormField
        label="Notes"
        name="notes"
        as="textarea"
        value={formData.notes}
        onChange={handleChange}
        rows={4}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <ApperIcon name="Calendar" size={18} />
          {appointment ? "Update Appointment" : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;