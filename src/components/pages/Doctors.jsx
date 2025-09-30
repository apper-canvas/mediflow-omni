import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const [doctorsData, departmentsData] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (departmentId) => {
const department = departments.find(
      (d) => d.Id.toString() === (departmentId?.Id || departmentId).toString()
    );
    return department ? department.name : "Unknown Department";
  };

  const getAvailabilityBadge = (status) => {
    const variants = {
      Available: "success",
      "In Consultation": "warning",
      "On Leave": "error"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadDoctors} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Doctors</h1>
          <p className="text-slate-600">Medical staff directory and availability</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
            <ApperIcon name="Stethoscope" className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Medical Staff</h2>
            <p className="text-sm text-slate-600">{doctors.length} doctors available</p>
          </div>
        </div>

        {doctors.length === 0 ? (
          <Empty
            icon="Stethoscope"
            title="No doctors found"
            description="No medical staff has been registered yet"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                    <ApperIcon name="UserCheck" className="text-primary" size={28} />
                  </div>
{getAvailabilityBadge(doctor.availability_status_c)}
                </div>

<h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name_c}</h3>
<p className="text-primary font-medium mb-4">{doctor.specialization_c}</p>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ApperIcon name="Building2" size={16} />
<span>{getDepartmentName(doctor.department_id_c)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
<ApperIcon name="Phone" size={16} />
                    <span>{doctor.phone_c}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ApperIcon name="Mail" size={16} />
                    <span>{doctor.email_c}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ApperIcon name="Award" size={16} />
                    <span>License: {doctor.licenseNumber}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Doctors;