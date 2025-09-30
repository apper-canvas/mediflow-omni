import mockRooms from "@/services/mockData/rooms.json";

let rooms = JSON.parse(JSON.stringify(mockRooms));
let bedIdCounter = Math.max(...rooms.flatMap(r => r.beds.map(b => b.bedId)), 0) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const roomService = {
  async getAll() {
    await delay(800);
    return JSON.parse(JSON.stringify(rooms));
  },

  async getById(id) {
    await delay(500);
    const room = rooms.find(r => r.Id === parseInt(id));
    if (!room) throw new Error("Room not found");
    return JSON.parse(JSON.stringify(room));
  },

  async getRoomsByWard(ward) {
    await delay(600);
    const filtered = rooms.filter(r => r.ward === ward);
    return JSON.parse(JSON.stringify(filtered));
  },

  async getBedsByStatus(status) {
    await delay(600);
    const allBeds = rooms.flatMap(room => 
      room.beds.map(bed => ({
        ...bed,
        roomNumber: room.roomNumber,
        ward: room.ward,
        floor: room.floor,
        roomType: room.roomType
      }))
    );
    const filtered = allBeds.filter(b => b.status === status);
    return JSON.parse(JSON.stringify(filtered));
  },

  async assignPatient(roomId, bedNumber, patientData) {
    await delay(700);
    const room = rooms.find(r => r.Id === parseInt(roomId));
    if (!room) throw new Error("Room not found");

    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) throw new Error("Bed not found");
    if (bed.status === "Occupied") throw new Error("Bed is already occupied");

    bed.status = "Occupied";
    bed.patientId = patientData.patientId;
    bed.patientName = patientData.patientName;
    bed.admissionDate = patientData.admissionDate;
    bed.notes = patientData.notes || null;

    return JSON.parse(JSON.stringify(room));
  },

  async unassignPatient(roomId, bedNumber) {
    await delay(700);
    const room = rooms.find(r => r.Id === parseInt(roomId));
    if (!room) throw new Error("Room not found");

    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) throw new Error("Bed not found");

    bed.status = "Available";
    bed.patientId = null;
    bed.patientName = null;
    bed.admissionDate = null;
    bed.notes = null;

    return JSON.parse(JSON.stringify(room));
  },

  async updateBedStatus(roomId, bedNumber, status, notes = null) {
    await delay(600);
    const room = rooms.find(r => r.Id === parseInt(roomId));
    if (!room) throw new Error("Room not found");

    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) throw new Error("Bed not found");

    const validStatuses = ["Available", "Occupied", "Reserved", "Maintenance", "Cleaning"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    bed.status = status;
    if (notes !== null) {
      bed.notes = notes;
    }

    if (status !== "Occupied") {
      bed.patientId = null;
      bed.patientName = null;
      bed.admissionDate = null;
    }

    return JSON.parse(JSON.stringify(room));
  },

  async create(roomData) {
    await delay(800);
    const newId = Math.max(...rooms.map(r => r.Id), 0) + 1;
    
    const newRoom = {
      Id: newId,
      roomNumber: roomData.roomNumber,
      ward: roomData.ward,
      floor: roomData.floor,
      roomType: roomData.roomType,
      beds: (roomData.beds || []).map(bed => ({
        bedId: bedIdCounter++,
        bedNumber: bed.bedNumber,
        status: bed.status || "Available",
        patientId: null,
        patientName: null,
        admissionDate: null,
        notes: null
      }))
    };

    rooms.push(newRoom);
    return JSON.parse(JSON.stringify(newRoom));
  },

  async update(id, roomData) {
    await delay(800);
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Room not found");

    const existingBeds = rooms[index].beds;
    rooms[index] = {
      ...rooms[index],
      roomNumber: roomData.roomNumber,
      ward: roomData.ward,
      floor: roomData.floor,
      roomType: roomData.roomType,
      beds: existingBeds
    };

    return JSON.parse(JSON.stringify(rooms[index]));
  },

  async delete(id) {
    await delay(700);
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Room not found");

    const room = rooms[index];
    const hasOccupiedBeds = room.beds.some(b => b.status === "Occupied");
    if (hasOccupiedBeds) {
      throw new Error("Cannot delete room with occupied beds");
    }

    rooms.splice(index, 1);
    return { success: true };
  }
};