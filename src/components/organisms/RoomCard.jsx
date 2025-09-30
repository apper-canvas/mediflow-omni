import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const RoomCard = ({ room, index, onAssignBed, onUnassignBed, onBedStatusChange }) => {
  const occupiedBeds = room.beds.filter(b => b.status === "Occupied").length;
  const totalBeds = room.beds.length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const getStatusColor = (status) => {
    const colors = {
      Available: "success",
      Occupied: "error",
      Reserved: "warning",
      Maintenance: "default",
      Cleaning: "info"
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Available: "Check",
      Occupied: "User",
      Reserved: "Clock",
      Maintenance: "Wrench",
      Cleaning: "Sparkles"
    };
    return icons[status] || "Bed";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" className="text-primary" size={20} />
            </div>
            <div>
<h3 className="text-lg font-bold text-slate-900">Room {room.room_number_c}</h3>
              <p className="text-sm text-slate-600">{room.ward_c} • Floor {room.floor_c}</p>
            </div>
          </div>
<Badge variant="primary">{room.room_type_c}</Badge>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Occupancy</span>
            <span className="font-semibold text-slate-900">{occupancyRate}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                occupancyRate === 100 ? "bg-error" : 
                occupancyRate >= 75 ? "bg-warning" : 
                "bg-success"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {occupiedBeds} of {totalBeds} beds occupied
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 mb-2">Beds:</p>
          {room.beds.map(bed => (
            <div
key={bed.bedId}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ApperIcon 
                    name={getStatusIcon(bed.status)} 
                    size={16} 
                    className={`text-${getStatusColor(bed.status)}`}
                  />
                  <span className="font-medium text-slate-900 text-sm">{bed.bed_number_c || bed.bedNumber}</span>
                </div>
                <Badge variant={getStatusColor(bed.status)} size="sm">
                  {bed.status}
                </Badge>
              </div>

              {bed.status === "Occupied" && bed.patientName && (
                <div className="mb-2 pl-6">
                  <p className="text-xs text-slate-600">Patient: {bed.patientName}</p>
                  <p className="text-xs text-slate-500">Admitted: {bed.admissionDate}</p>
                  {bed.notes && (
                    <p className="text-xs text-slate-500 italic mt-1">{bed.notes}</p>
                  )}
                </div>
              )}

              {bed.notes && bed.status !== "Occupied" && (
                <p className="text-xs text-slate-500 italic pl-6 mb-2">{bed.notes}</p>
              )}

              <div className="flex items-center gap-2 pl-6">
                {bed.status === "Occupied" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUnassignBed(room, bed)}
                    className="text-error hover:bg-error/10 !p-1.5"
                  >
                    <ApperIcon name="UserMinus" size={14} />
                    <span className="text-xs">Discharge</span>
                  </Button>
                ) : bed.status === "Available" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAssignBed(room, bed)}
                    className="text-success hover:bg-success/10 !p-1.5"
                  >
                    <ApperIcon name="UserPlus" size={14} />
                    <span className="text-xs">Assign</span>
                  </Button>
                ) : null}

                {bed.status !== "Occupied" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBedStatusChange(room, bed, "Available")}
                    className="text-primary hover:bg-primary/10 !p-1.5"
                  >
                    <ApperIcon name="RefreshCw" size={14} />
                    <span className="text-xs">Reset</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;