import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import AppointmentForm from "@/components/organisms/AppointmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [statusFilter, appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    if (statusFilter === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((a) => a.status === statusFilter)
      );
    }
  };

  const getPatientName = (patientId) => {
const patient = patients.find((p) => p.Id.toString() === (patientId?.Id || patientId).toString());
    return patient ? `${patient.first_name_c} ${patient.last_name_c}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
const doctor = doctors.find((d) => d.Id.toString() === (doctorId?.Id || doctorId).toString());
    return doctor ? doctor.name_c : "Unknown Doctor";
  };

  const getStatusBadge = (status) => {
    const variants = {
      Scheduled: "info",
      Completed: "success",
      Cancelled: "error"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await appointmentService.updateStatus(appointmentToCancel, "Cancelled");
      setAppointments((prev) =>
        prev.map((a) =>
          a.Id === appointmentToCancel ? { ...a, status: "Cancelled" } : a
        )
      );
      toast.success("Appointment cancelled successfully");
    } catch (err) {
      toast.error("Failed to cancel appointment");
    } finally {
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const handleSubmit = async (appointmentData) => {
    try {
      if (selectedAppointment) {
        const updated = await appointmentService.update(
          selectedAppointment.Id,
          appointmentData
        );
        setAppointments((prev) =>
          prev.map((a) => (a.Id === selectedAppointment.Id ? updated : a))
        );
        toast.success("Appointment updated successfully");
      } else {
        const newAppointment = await appointmentService.create(appointmentData);
        setAppointments((prev) => [...prev, newAppointment]);
        toast.success("Appointment scheduled successfully");
      }
      setIsModalOpen(false);
      setSelectedAppointment(null);
    } catch (err) {
      toast.error("Failed to save appointment");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Appointments</h1>
          <p className="text-slate-600">Manage patient appointments and schedules</p>
        </div>
        <Button variant="primary" onClick={handleAddAppointment} size="lg">
          <ApperIcon name="CalendarPlus" size={20} />
          Schedule Appointment
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">All Appointments</h2>
              <p className="text-sm text-slate-600">{filteredAppointments.length} appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Filter by status:</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No appointments found"
            description="Schedule your first appointment to get started"
            action={handleAddAppointment}
            actionLabel="Schedule Appointment"
          />
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-200 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
{format(new Date(appointment.date_c), "d")}
                      </p>
                      <p className="text-xs text-slate-600">
{format(new Date(appointment.date_c), "MMM")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
{appointment.reason_c}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <ApperIcon name="User" size={14} />
<span>{getPatientName(appointment.patient_id_c)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ApperIcon name="Stethoscope" size={14} />
<span>{getDoctorName(appointment.doctor_id_c)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ApperIcon name="Clock" size={14} />
<span>{appointment.time_c}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
{getStatusBadge(appointment.status_c)}
                  <div className="flex items-center gap-2">
{appointment.status_c === "Scheduled" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAppointment(appointment)}
                          className="!p-2"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.Id)}
                          className="!p-2 text-error hover:bg-error/10"
                        >
                          <ApperIcon name="X" size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        title={selectedAppointment ? "Edit Appointment" : "Schedule New Appointment"}
        size="lg"
      >
        <AppointmentForm
          appointment={selectedAppointment}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => {
          setCancelDialogOpen(false);
          setAppointmentToCancel(null);
        }}
        onConfirm={confirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? The patient will need to reschedule."
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
      />
    </div>
  );
};

export default Appointments;