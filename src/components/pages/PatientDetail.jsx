import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { doctorService } from "@/services/api/doctorService";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [patientData, appointmentsData, recordsData, doctorsData] = await Promise.all([
        patientService.getById(id),
        appointmentService.getByPatientId(id),
        medicalRecordService.getByPatientId(id),
        doctorService.getAll()
      ]);
      setPatient(patientData);
      setAppointments(appointmentsData);
      setMedicalRecords(recordsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d.Id.toString() === doctorId.toString());
    return doctor ? doctor.name : "Unknown Doctor";
  };

  const getStatusBadge = (status) => {
    const variants = {
      Scheduled: "info",
      Completed: "success",
      Cancelled: "error",
      Active: "success"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadPatientData} />;
  if (!patient) return <Error message="Patient not found" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/patients")}>
          <ApperIcon name="ArrowLeft" size={20} />
          Back to Patients
        </Button>
        <Button variant="primary">
          <ApperIcon name="Edit" size={18} />
          Edit Patient
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ApperIcon name="User" size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center gap-4 text-primary-light">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" size={16} />
                  <span>{patient.age} years old</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Phone" size={16} />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Mail" size={16} />
                  <span>{patient.email}</span>
                </div>
              </div>
            </div>
          </div>
          {getStatusBadge(patient.status)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-primary-light text-sm mb-1">Blood Group</p>
            <p className="text-2xl font-bold">{patient.bloodGroup}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-primary-light text-sm mb-1">Gender</p>
            <p className="text-2xl font-bold">{patient.gender}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-primary-light text-sm mb-1">Appointments</p>
            <p className="text-2xl font-bold">{appointments.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-primary-light text-sm mb-1">Medical Records</p>
            <p className="text-2xl font-bold">{medicalRecords.length}</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-card">
        <div className="border-b border-slate-200">
          <div className="flex gap-1 p-2">
            {["info", "appointments", "records"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Date of Birth</span>
                      <span className="font-medium text-slate-900">
                        {format(new Date(patient.dateOfBirth), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Registration Date</span>
                      <span className="font-medium text-slate-900">
                        {format(new Date(patient.registrationDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Address</span>
                      <span className="font-medium text-slate-900 text-right">{patient.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-2">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Contact Name</span>
                      <span className="font-medium text-slate-900">{patient.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Contact Phone</span>
                      <span className="font-medium text-slate-900">{patient.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Medical Information</h3>
                <div className="bg-gradient-to-r from-warning/10 to-transparent rounded-lg p-4 border border-warning/20">
                  <div className="flex items-start gap-3">
                    <ApperIcon name="AlertCircle" className="text-warning mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Allergies</p>
                      {patient.allergies && patient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="warning">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600">No known allergies</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Calendar" className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{appointment.reason}</p>
                        <p className="text-sm text-slate-600">
                          {format(new Date(appointment.date), "MMMM d, yyyy")} at {appointment.time}
                        </p>
                        <p className="text-sm text-slate-600">
                          Dr. {getDoctorName(appointment.doctorId)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Calendar" className="mx-auto mb-3 text-slate-300" size={48} />
                  <p className="text-slate-600">No appointments found</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "records" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {medicalRecords.length > 0 ? (
                medicalRecords.map((record, index) => (
                  <motion.div
                    key={record.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {record.chiefComplaint}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {format(new Date(record.visitDate), "MMMM d, yyyy")} • 
                          Dr. {getDoctorName(record.doctorId)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Diagnosis</p>
                        <p className="text-slate-900">{record.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Treatment</p>
                        <p className="text-slate-900">{record.treatment}</p>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-600 mb-1">Notes</p>
                        <p className="text-slate-900">{record.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="FileText" className="mx-auto mb-3 text-slate-300" size={48} />
                  <p className="text-slate-600">No medical records found</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;