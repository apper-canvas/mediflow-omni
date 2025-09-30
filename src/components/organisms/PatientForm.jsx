import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PatientForm = ({ patient, doctors = [], onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    date_of_birth_c: "",
    age_c: "",
    gender_c: "Male",
    blood_group_c: "A+",
    phone_c: "",
    email_c: "",
    address_c: "",
    emergency_contact_c: "",
    emergency_phone_c: "",
    allergies_c: "",
    doctor_id_c: ""
  });

useEffect(() => {
if (patient) {
      setFormData({
        ...patient,
        allergies_c: Array.isArray(patient.allergies_c) ? patient.allergies_c.join(", ") : (patient.allergies_c || ""),
        doctor_id_c: patient.doctor_id_c?.Id || patient.doctor_id_c || ""
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
...formData,
      allergies_c: formData.allergies_c.split(",").map((a) => a.trim()).filter(Boolean),
      doctor_id_c: formData.doctor_id_c || undefined
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
name="first_name_c"
          value={formData.first_name_c}
          onChange={handleChange}
          required
        />
<FormField
          label="Last Name"
          name="last_name_c"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <FormField
label="Date of Birth"
          name="date_of_birth_c"
          type="date"
          value={formData.date_of_birth_c}
          onChange={handleChange}
          required
        />
        <FormField
label="Age"
          name="age_c"
          type="number"
          value={formData.age_c}
          onChange={handleChange}
          required
        />
        <FormField
label="Gender"
          name="gender_c"
          as="select"
          value={formData.gender_c}
          onChange={handleChange}
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </FormField>
        <FormField
label="Blood Group"
          name="blood_group_c"
          as="select"
          value={formData.blood_group_c}
          onChange={handleChange}
          required
        >
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </FormField>
        <FormField
label="Phone"
          name="phone_c"
          type="tel"
          value={formData.phone_c}
          onChange={handleChange}
          required
        />
        <FormField
label="Email"
          name="email_c"
          type="email"
          value={formData.email_c}
          onChange={handleChange}
          required
        />
        <FormField
label="Emergency Contact Name"
          name="emergency_contact_c"
          value={formData.emergency_contact_c}
          onChange={handleChange}
          required
        />
        <FormField
          label="Emergency Phone"
name="emergency_phone_c"
          type="tel"
          value={formData.emergency_phone_c}
          onChange={handleChange}
          required
/>
      </div>

      <FormField
        label="Doctor"
        name="doctor_id_c"
        type="select"
        value={formData.doctor_id_c}
        onChange={handleChange}
        options={[
          { value: "", label: "Select Doctor" },
          ...doctors.map(doc => ({ 
            value: doc.Id, 
            label: doc.name_c || doc.Name 
          }))
        ]}
      />
      
      <FormField
label="Address"
        name="address_c"
        as="textarea"
        value={formData.address_c}
        onChange={handleChange}
        rows={3}
        required
      />
      
      <FormField
label="Allergies"
        name="allergies_c"
        value={formData.allergies_c}
        onChange={handleChange}
        placeholder="Enter allergies separated by commas"
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <ApperIcon name="Save" size={18} />
          {patient ? "Update Patient" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;