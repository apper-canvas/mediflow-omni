import { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const BedAssignmentForm = ({ bed, patients, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    admissionDate: format(new Date(), "yyyy-MM-dd"),
    notes: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = "Please select a patient";
    }

    if (!formData.admissionDate) {
      newErrors.admissionDate = "Admission date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const selectedPatient = patients.find(p => p.Id === parseInt(formData.patientId));
    
    const assignmentData = {
      patientId: parseInt(formData.patientId),
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      admissionDate: formData.admissionDate,
      notes: formData.notes.trim() || null
    };

    onSubmit(assignmentData);
  };

  const activePatients = patients.filter(p => p.status === "Active");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Bed Assignment</p>
            <p className="text-xs text-slate-600 mt-1">
              Room {bed.roomNumber} • Bed {bed.bedNumber}
            </p>
          </div>
          <div className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
            Available
          </div>
        </div>
      </div>

      <FormField
        label="Select Patient"
        error={errors.patientId}
        required
      >
        <Select
          value={formData.patientId}
          onChange={(e) => handleChange("patientId", e.target.value)}
          error={!!errors.patientId}
        >
          <option value="">Choose a patient...</option>
          {activePatients.map(patient => (
            <option key={patient.Id} value={patient.Id}>
              {patient.firstName} {patient.lastName} - ID: {patient.Id} ({patient.age} years, {patient.bloodGroup})
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Admission Date"
        error={errors.admissionDate}
        required
      >
        <Input
          type="date"
          value={formData.admissionDate}
          onChange={(e) => handleChange("admissionDate", e.target.value)}
          error={!!errors.admissionDate}
          max={format(new Date(), "yyyy-MM-dd")}
        />
      </FormField>

      <FormField
        label="Notes"
        error={errors.notes}
      >
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={4}
          placeholder="Add any relevant notes about the admission..."
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
      </FormField>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Assign Patient
        </Button>
      </div>
    </form>
  );
};

export default BedAssignmentForm;