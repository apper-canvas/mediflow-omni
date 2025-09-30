import { bedService } from './bedService';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const roomService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "room_type_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('room_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      const rooms = [];
      for (const room of response.data) {
        const beds = await bedService.getByRoomId(room.Id);
        rooms.push({
          ...room,
          beds: beds || []
        });
      }
      
      return rooms;
    } catch (error) {
      console.error("apper_info: An error was received in fetching rooms. The error is:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "room_type_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('room_c', parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      const beds = await bedService.getByRoomId(response.data.Id);
      
      return {
        ...response.data,
        beds: beds || []
      };
    } catch (error) {
      console.error(`apper_info: An error was received in fetching room ${id}. The error is:`, error.message);
      return null;
    }
  },

  async getRoomsByWard(ward) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "room_type_c"}}
        ],
        where: [
          {"FieldName": "ward_c", "Operator": "EqualTo", "Values": [ward]}
        ]
      };
      
      const response = await apperClient.fetchRecords('room_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      const rooms = [];
      for (const room of response.data) {
        const beds = await bedService.getByRoomId(room.Id);
        rooms.push({
          ...room,
          beds: beds || []
        });
      }
      
      return rooms;
    } catch (error) {
      console.error("apper_info: An error was received in fetching rooms by ward. The error is:", error.message);
      return [];
    }
  },

  async getBedsByStatus(status) {
    return await bedService.getByStatus(status);
  },

  async assignPatient(roomId, bedNumber, patientData) {
    return await bedService.assignPatient(roomId, bedNumber, patientData);
  },

  async unassignPatient(roomId, bedNumber) {
    return await bedService.unassignPatient(roomId, bedNumber);
  },

  async updateBedStatus(roomId, bedNumber, status, notes = null) {
    return await bedService.updateStatus(roomId, bedNumber, status, notes);
  },

  async create(roomData) {
    try {
      const params = {
        records: [{
          room_number_c: roomData.room_number_c,
          ward_c: roomData.ward_c,
          floor_c: roomData.floor_c,
          room_type_c: roomData.room_type_c
        }]
      };
      
      const response = await apperClient.createRecord('room_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating room. The response body is:", JSON.stringify(response));
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("apper_info: An error was received in creating room. The error is:", error.message);
      return null;
    }
  },

  async update(id, roomData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          room_number_c: roomData.room_number_c,
          ward_c: roomData.ward_c,
          floor_c: roomData.floor_c,
          room_type_c: roomData.room_type_c
        }]
      };
      
      const response = await apperClient.updateRecord('room_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating room. The response body is:", JSON.stringify(response));
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("apper_info: An error was received in updating room. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const beds = await bedService.getByRoomId(id);
      const hasOccupiedBeds = beds.some(b => b.status_c === "Occupied");
      
      if (hasOccupiedBeds) {
        console.error("apper_info: Cannot delete room with occupied beds");
        return { success: false, message: "Cannot delete room with occupied beds" };
      }
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('room_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting room. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting room. The error is:", error.message);
      return { success: false };
    }
  }
};