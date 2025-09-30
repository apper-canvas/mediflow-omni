import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "Male",
    bloodGroup: "A+",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: ""
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        allergies: patient.allergies?.join(", ") || ""
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
      allergies: formData.allergies.split(",").map((a) => a.trim()).filter(Boolean)
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
        <FormField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <FormField
          label="Gender"
          name="gender"
          as="select"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </FormField>
        <FormField
          label="Blood Group"
          name="bloodGroup"
          as="select"
          value={formData.bloodGroup}
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
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Emergency Contact Name"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          required
        />
        <FormField
          label="Emergency Phone"
          name="emergencyPhone"
          type="tel"
          value={formData.emergencyPhone}
          onChange={handleChange}
          required
        />
      </div>
      
      <FormField
        label="Address"
        name="address"
        as="textarea"
        value={formData.address}
        onChange={handleChange}
        rows={3}
        required
      />
      
      <FormField
        label="Allergies"
        name="allergies"
        value={formData.allergies}
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