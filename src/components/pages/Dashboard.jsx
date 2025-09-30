import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";
import { roomService } from "@/services/api/roomService";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Patients from "@/components/pages/Patients";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

const [patients, appointments, doctors, departments, rooms] = await Promise.all([
        patientService.getAll(),
        appointmentService.getTodayAppointments(),
        doctorService.getAll(),
        departmentService.getAll(),
        roomService.getAll()
      ]);

      const allAppointments = await appointmentService.getAll();

      setStats({
        totalPatients: patients.length,
        todayAppointments: appointments.length,
        totalDoctors: doctors.length,
departments: departments.length,
        scheduledCount: appointments.filter((a) => a.status === "Scheduled").length,
        completedCount: allAppointments.filter((a) => a.status === "Completed").length,
        totalRooms: rooms.length,
        occupiedBeds: rooms.reduce((acc, room) => acc + room.beds.filter(b => b.status === "Occupied").length, 0),
        availableBeds: rooms.reduce((acc, room) => acc + room.beds.filter(b => b.status === "Available").length, 0)
      });

      setTodayAppointments(appointments.slice(0, 5));
      setRecentPatients(patients.slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Scheduled: "info",
      Completed: "success",
      Cancelled: "error"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your hospital overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">Today's Date</p>
          <p className="text-lg font-semibold text-slate-900">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="Users"
          title="Total Patients"
          value={stats.totalPatients}
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          icon="Calendar"
          title="Today's Appointments"
          value={stats.todayAppointments}
          color="success"
          trend="up"
          trendValue={`${stats.scheduledCount} scheduled`}
        />
        <StatCard
          icon="Stethoscope"
          title="Total Doctors"
          value={stats.totalDoctors}
color="info"
        />
        <StatCard
          icon="Building2"
          title="Departments"
          value={stats.departments}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <StatCard
          icon="Bed"
          title="Total Rooms"
          value={stats.totalRooms}
          color="primary"
        />
        <StatCard
          icon="UserCheck"
          title="Occupied Beds"
          value={stats.occupiedBeds}
          color="error"
        />
        <StatCard
          icon="BedDouble"
          title="Available Beds"
          value={stats.availableBeds}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Today's Appointments</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/appointments")}>
              View All
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-200 hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Clock" className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{appointment.reason}</p>
                      <p className="text-sm text-slate-600">
                        Patient ID: #{appointment.patientId} • {appointment.time}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="mx-auto mb-3 text-slate-300" size={48} />
                <p className="text-slate-600">No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Patients</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/patients")}>
              View All
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <motion.div
                key={patient.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-200 hover:border-primary/30 transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/patients/${patient.Id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-accent/5 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="text-success" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {patient.age} years • {patient.bloodGroup}
                    </p>
                  </div>
                </div>
                <Badge variant="success">{patient.status}</Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
            <p className="text-primary-light">Streamline your workflow with these shortcuts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/patients")}
              className="bg-white text-primary hover:bg-primary-light hover:text-white"
            >
              <ApperIcon name="UserPlus" size={18} />
              Register Patient
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/appointments")}
              className="bg-white text-primary hover:bg-primary-light hover:text-white"
            >
              <ApperIcon name="Calendar" size={18} />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;