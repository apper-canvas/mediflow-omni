import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { departmentService } from "@/services/api/departmentService";
import { doctorService } from "@/services/api/doctorService";
import { appointmentService } from "@/services/api/appointmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [departmentsData, doctorsData, appointmentsData] = await Promise.all([
        departmentService.getAll(),
        doctorService.getAll(),
        appointmentService.getTodayAppointments()
      ]);
      setDepartments(departmentsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorCount = (departmentId) => {
    return doctors.filter(
      (d) => d.departmentId === departmentId.toString()
    ).length;
  };

  const getTodayAppointmentCount = (departmentId) => {
    return appointments.filter(
      (a) => a.departmentId === departmentId.toString()
    ).length;
  };

  const getHeadDoctorName = (headDoctorId) => {
    const doctor = doctors.find((d) => d.Id.toString() === headDoctorId.toString());
    return doctor ? doctor.name : "Not assigned";
  };

  const departmentIcons = {
    "General Medicine": "Stethoscope",
    "Cardiology": "Heart",
    "General Surgery": "Scissors",
    "Pediatrics": "Baby",
    "Orthopedics": "Bone",
    "Dermatology": "Fingerprint",
    "Neurology": "Brain",
    "Emergency": "AlertCircle"
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Departments</h1>
          <p className="text-slate-600">Hospital departments and specialties</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">All Departments</h2>
            <p className="text-sm text-slate-600">{departments.length} specialized departments</p>
          </div>
        </div>

        {departments.length === 0 ? (
          <Empty
            icon="Building2"
            title="No departments found"
            description="No departments have been created yet"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department, index) => (
              <motion.div
                key={department.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-primary/5 to-white rounded-xl p-6 border-2 border-primary/20 hover:border-primary/40 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                    <ApperIcon
                      name={departmentIcons[department.name] || "Building2"}
                      className="text-white"
                      size={24}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600">Floor</p>
                    <p className="text-xl font-bold text-primary">{department.floor}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {department.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{department.description}</p>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="UserCheck" size={16} className="text-primary" />
                    <span className="text-slate-600">Head: </span>
                    <span className="font-medium text-slate-900">
                      {getHeadDoctorName(department.headDoctorId)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <ApperIcon name="Users" size={16} className="text-primary" />
                      <span className="text-slate-600">
                        {getDoctorCount(department.Id)} doctors
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ApperIcon name="Calendar" size={16} className="text-success" />
                      <span className="font-medium text-success">
                        {getTodayAppointmentCount(department.Id)} today
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ApperIcon name="Phone" size={16} />
                    <span>Ext: {department.extension}</span>
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

export default Departments;