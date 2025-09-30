import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import PatientTable from "@/components/organisms/PatientTable";
import PatientForm from "@/components/organisms/PatientForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [doctors, setDoctors] = useState([]);
useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  const loadDoctors = async () => {
    try {
      const data = await doctorService.getAll();
      setDoctors(data || []);
    } catch (err) {
      console.error("Error loading doctors:", err);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = patients.filter(
      (p) =>
p.first_name_c?.toLowerCase().includes(lowerQuery) ||
        p.last_name_c?.toLowerCase().includes(lowerQuery) ||
        p.Id.toString().includes(lowerQuery) ||
        p.phone_c?.includes(query)
    );
    setFilteredPatients(filtered);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patientId) => {
    setPatientToDelete(patientId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await patientService.delete(patientToDelete);
      setPatients((prev) => prev.filter((p) => p.Id !== patientToDelete));
      setFilteredPatients((prev) => prev.filter((p) => p.Id !== patientToDelete));
      toast.success("Patient deleted successfully");
    } catch (err) {
      toast.error("Failed to delete patient");
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleSubmit = async (patientData) => {
    try {
      if (selectedPatient) {
        const updated = await patientService.update(selectedPatient.Id, patientData);
        setPatients((prev) =>
          prev.map((p) => (p.Id === selectedPatient.Id ? updated : p))
        );
        setFilteredPatients((prev) =>
          prev.map((p) => (p.Id === selectedPatient.Id ? updated : p))
        );
        toast.success("Patient updated successfully");
      } else {
        const newPatient = await patientService.create(patientData);
        setPatients((prev) => [...prev, newPatient]);
        setFilteredPatients((prev) => [...prev, newPatient]);
        toast.success("Patient registered successfully");
      }
      setIsModalOpen(false);
      setSelectedPatient(null);
    } catch (err) {
      toast.error("Failed to save patient");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patients</h1>
          <p className="text-slate-600">Manage patient records and information</p>
        </div>
        <Button variant="primary" onClick={handleAddPatient} size="lg">
          <ApperIcon name="UserPlus" size={20} />
          Register Patient
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
              <ApperIcon name="Users" className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">All Patients</h2>
              <p className="text-sm text-slate-600">{filteredPatients.length} registered patients</p>
            </div>
          </div>
          <SearchBar
            placeholder="Search patients..."
            onSearch={handleSearch}
            className="w-80"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <Empty
            icon="Users"
            title="No patients found"
            description="Register your first patient to get started with patient management"
            action={handleAddPatient}
            actionLabel="Register Patient"
          />
        ) : (
          <PatientTable
            patients={filteredPatients}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        title={selectedPatient ? "Edit Patient" : "Register New Patient"}
        size="lg"
      >
<PatientForm
          patient={selectedPatient}
          doctors={doctors}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedPatient(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Patients;