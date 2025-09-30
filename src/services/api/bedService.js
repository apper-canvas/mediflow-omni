const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const bedService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "room_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('bed_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching beds. The error is:", error.message);
      return [];
    }
  },

  async getByRoomId(roomId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "room_id_c", "Operator": "EqualTo", "Values": [parseInt(roomId)]}
        ]
      };
      
      const response = await apperClient.fetchRecords('bed_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(bed => ({
        ...bed,
        bedId: bed.Id,
        bedNumber: bed.bed_number_c,
        status: bed.status_c,
        patientId: bed.patient_id_c?.Id || null,
        patientName: bed.patient_name_c,
        admissionDate: bed.admission_date_c,
        notes: bed.notes_c
      }));
    } catch (error) {
      console.error("apper_info: An error was received in fetching beds by room. The error is:", error.message);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"name": "room_id_c"}, "referenceField": {"field": {"Name": "room_number_c"}}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}
        ]
      };
      
      const response = await apperClient.fetchRecords('bed_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching beds by status. The error is:", error.message);
      return [];
    }
  },

  async assignPatient(roomId, bedNumber, patientData) {
    try {
      const bedsInRoom = await this.getByRoomId(roomId);
      const bed = bedsInRoom.find(b => b.bed_number_c === bedNumber);
      
      if (!bed) {
        console.error("apper_info: Bed not found");
        return null;
      }
      
      if (bed.status_c === "Occupied") {
        console.error("apper_info: Bed is already occupied");
        return null;
      }
      
      const params = {
        records: [{
          Id: bed.Id,
          status_c: "Occupied",
          patient_id_c: parseInt(patientData.patientId),
          patient_name_c: patientData.patientName,
          admission_date_c: patientData.admissionDate,
          notes_c: patientData.notes || null
        }]
      };
      
      const response = await apperClient.updateRecord('bed_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in assigning patient to bed. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in assigning patient to bed. The error is:", error.message);
      return null;
    }
  },

  async unassignPatient(roomId, bedNumber) {
    try {
      const bedsInRoom = await this.getByRoomId(roomId);
      const bed = bedsInRoom.find(b => b.bed_number_c === bedNumber);
      
      if (!bed) {
        console.error("apper_info: Bed not found");
        return null;
      }
      
      const params = {
        records: [{
          Id: bed.Id,
          status_c: "Available",
          patient_id_c: null,
          patient_name_c: null,
          admission_date_c: null,
          notes_c: null
        }]
      };
      
      const response = await apperClient.updateRecord('bed_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in unassigning patient from bed. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in unassigning patient from bed. The error is:", error.message);
      return null;
    }
  },

  async updateStatus(roomId, bedNumber, status, notes = null) {
    try {
      const bedsInRoom = await this.getByRoomId(roomId);
      const bed = bedsInRoom.find(b => b.bed_number_c === bedNumber);
      
      if (!bed) {
        console.error("apper_info: Bed not found");
        return null;
      }
      
      const validStatuses = ["Available", "Occupied", "Reserved", "Maintenance", "Cleaning"];
      if (!validStatuses.includes(status)) {
        console.error("apper_info: Invalid bed status");
        return null;
      }
      
      const updateData = {
        Id: bed.Id,
        status_c: status
      };
      
      if (notes !== null) {
        updateData.notes_c = notes;
      }
      
      if (status !== "Occupied") {
        updateData.patient_id_c = null;
        updateData.patient_name_c = null;
        updateData.admission_date_c = null;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('bed_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating bed status. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating bed status. The error is:", error.message);
      return null;
    }
  },

  async create(bedData) {
    try {
      const params = {
        records: [{
          room_id_c: parseInt(bedData.room_id_c),
          bed_number_c: bedData.bed_number_c,
          status_c: bedData.status_c || "Available",
          patient_id_c: bedData.patient_id_c ? parseInt(bedData.patient_id_c) : null,
          patient_name_c: bedData.patient_name_c || null,
          admission_date_c: bedData.admission_date_c || null,
          notes_c: bedData.notes_c || null
        }]
      };
      
      const response = await apperClient.createRecord('bed_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating bed. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in creating bed. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('bed_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting bed. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting bed. The error is:", error.message);
      return { success: false };
    }
  }
};