import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { roomService } from "@/services/api/roomService";
import { patientService } from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import RoomCard from "@/components/organisms/RoomCard";
import BedAssignmentForm from "@/components/organisms/BedAssignmentForm";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWard, setSelectedWard] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, selectedWard, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [roomsData, patientsData] = await Promise.all([
        roomService.getAll(),
        patientService.getAll()
      ]);
      setRooms(roomsData);
      setPatients(patientsData);
      setFilteredRooms(roomsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = [...rooms];

    if (selectedWard !== "All") {
filtered = filtered.filter(r => r.ward_c === selectedWard);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.room_number_c?.toLowerCase().includes(query) ||
        r.ward_c?.toLowerCase().includes(query) ||
        r.room_type_c?.toLowerCase().includes(query) ||
        r.beds.some(b => b.bed_number_c?.toLowerCase().includes(query))
      );
    }

    setFilteredRooms(filtered);
  };

  const handleAssignBed = (room, bed) => {
    if (bed.status === "Occupied") {
      toast.warning("This bed is already occupied");
      return;
    }
setSelectedBed({ ...bed, roomId: room.Id, roomNumber: room.room_number_c });
    setAssignmentModalOpen(true);
  };

const handleUnassignBed = (room, bed) => {
    setActionToConfirm({
      type: "unassign",
      roomId: room.Id,
      bedNumber: bed.bed_number_c,
      patientName: bed.patient_name_c || 'Unknown Patient'
    });
    setConfirmDialogOpen(true);
  };

  const handleBedStatusChange = (room, bed, newStatus) => {
    setActionToConfirm({
      type: "statusChange",
roomId: room.Id,
      bedNumber: bed.bed_number_c,
      newStatus,
      bedId: bed.bed_number_c
    });
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (actionToConfirm.type === "unassign") {
await roomService.unassignPatient(
          actionToConfirm.roomId,
          actionToConfirm.bedNumber
        );
        toast.success("Patient discharged successfully");
      } else if (actionToConfirm.type === "statusChange") {
        await roomService.updateBedStatus(
          actionToConfirm.roomId,
          actionToConfirm.bedNumber,
          actionToConfirm.newStatus
        );
        toast.success("Bed status updated successfully");
      }
      await loadData();
    } catch (err) {
      toast.error(err.message || "Failed to perform action");
    } finally {
      setConfirmDialogOpen(false);
      setActionToConfirm(null);
    }
  };

  const handleAssignmentSubmit = async (assignmentData) => {
    try {
      await roomService.assignPatient(
        selectedBed.roomId,
        selectedBed.bedNumber,
        assignmentData
      );
      toast.success("Patient assigned to bed successfully");
      setAssignmentModalOpen(false);
      setSelectedBed(null);
      await loadData();
    } catch (err) {
      toast.error(err.message || "Failed to assign patient");
    }
  };

const wards = ["All", ...new Set(rooms.map(r => r.ward_c))];

  const stats = {
    totalRooms: rooms.length,
    totalBeds: rooms.reduce((acc, r) => acc + r.beds.length, 0),
    occupiedBeds: rooms.reduce((acc, r) => acc + r.beds.filter(b => b.status === "Occupied").length, 0),
    availableBeds: rooms.reduce((acc, r) => acc + r.beds.filter(b => b.status === "Available").length, 0),
    reservedBeds: rooms.reduce((acc, r) => acc + r.beds.filter(b => b.status === "Reserved").length, 0)
  };

  const occupancyRate = stats.totalBeds > 0 
    ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100) 
    : 0;

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Room Management</h1>
          <p className="text-slate-600">Manage bed assignments and room availability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Rooms</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalRooms}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bed" className="text-info" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Beds</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalBeds}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="text-error" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Occupied</p>
              <p className="text-2xl font-bold text-slate-900">{stats.occupiedBeds}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="BedDouble" className="text-success" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Available</p>
              <p className="text-2xl font-bold text-slate-900">{stats.availableBeds}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Percent" className="text-warning" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Occupancy</p>
              <p className="text-2xl font-bold text-slate-900">{occupancyRate}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bed" className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">All Rooms</h2>
              <p className="text-sm text-slate-600">{filteredRooms.length} rooms</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full sm:w-48"
            >
              {wards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </Select>
            <SearchBar
              placeholder="Search rooms, beds..."
              onSearch={setSearchQuery}
              className="w-full sm:w-80"
            />
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <Empty
            icon="Bed"
            title="No rooms found"
            description="No rooms match your search criteria. Try adjusting your filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <RoomCard
                key={room.Id}
                room={room}
                index={index}
                onAssignBed={handleAssignBed}
                onUnassignBed={handleUnassignBed}
                onBedStatusChange={handleBedStatusChange}
              />
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={assignmentModalOpen}
        onClose={() => {
          setAssignmentModalOpen(false);
          setSelectedBed(null);
        }}
        title="Assign Patient to Bed"
        size="lg"
      >
        {selectedBed && (
          <BedAssignmentForm
            bed={selectedBed}
            patients={patients}
            onSubmit={handleAssignmentSubmit}
            onCancel={() => {
              setAssignmentModalOpen(false);
              setSelectedBed(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setActionToConfirm(null);
        }}
        onConfirm={confirmAction}
        title={
          actionToConfirm?.type === "unassign" 
            ? "Discharge Patient" 
            : "Change Bed Status"
        }
        message={
          actionToConfirm?.type === "unassign"
            ? `Are you sure you want to discharge ${actionToConfirm?.patientName} from ${actionToConfirm?.bedNumber}?`
            : `Are you sure you want to change bed ${actionToConfirm?.bedId} status to ${actionToConfirm?.newStatus}?`
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RoomManagement;