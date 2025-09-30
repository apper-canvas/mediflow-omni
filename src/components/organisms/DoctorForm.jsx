import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";

const DoctorForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name_c: "",
    specialization_c: "",
    department_id_c: "",
    phone_c: "",
    email_c: "",
    license_number_c: ""
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data || []);
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = "Name is required";
    }

    if (!formData.specialization_c.trim()) {
      newErrors.specialization_c = "Specialization is required";
    }

    if (!formData.department_id_c) {
      newErrors.department_id_c = "Department is required";
    }

    if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Invalid email format";
    }

    if (!formData.license_number_c.trim()) {
      newErrors.license_number_c = "License number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await doctorService.create(formData);

      if (result) {
        toast.success("Doctor created successfully");
        setFormData({
          name_c: "",
          specialization_c: "",
          department_id_c: "",
          phone_c: "",
          email_c: "",
          license_number_c: ""
        });
        setErrors({});
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Failed to create doctor");
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      toast.error("Failed to create doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          required
          name="name_c"
          value={formData.name_c}
          onChange={handleChange}
          error={errors.name_c}
          placeholder="Dr. John Smith"
          disabled={loading}
        />

        <FormField
          label="Specialization"
          required
          name="specialization_c"
          value={formData.specialization_c}
          onChange={handleChange}
          error={errors.specialization_c}
          placeholder="Cardiology"
          disabled={loading}
        />

        <FormField
          label="Department"
          required
          as="select"
          name="department_id_c"
          value={formData.department_id_c}
          onChange={handleChange}
          error={errors.department_id_c}
          disabled={loading || loadingDepartments}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.Id} value={dept.Id}>
              {dept.Name}
            </option>
          ))}
        </FormField>

        <FormField
          label="Phone"
          required
          type="tel"
          name="phone_c"
          value={formData.phone_c}
          onChange={handleChange}
          error={errors.phone_c}
          placeholder="+1 (555) 123-4567"
          disabled={loading}
        />

        <FormField
          label="Email"
          required
          type="email"
          name="email_c"
          value={formData.email_c}
          onChange={handleChange}
          error={errors.email_c}
          placeholder="doctor@hospital.com"
          disabled={loading}
          className="md:col-span-2"
        />

        <FormField
          label="License Number"
          required
          name="license_number_c"
          value={formData.license_number_c}
          onChange={handleChange}
          error={errors.license_number_c}
          placeholder="MD123456"
          disabled={loading}
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || loadingDepartments}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={18} />
              Create Doctor
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DoctorForm;