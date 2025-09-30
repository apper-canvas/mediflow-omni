const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const appointmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching appointments. The error is:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('appointment_c', parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`apper_info: An error was received in fetching appointment ${id}. The error is:`, error.message);
      return null;
    }
  },

  async getByPatientId(patientId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}
        ]
      };
      
      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching appointments by patient. The error is:", error.message);
      return [];
    }
  },

  async getByDate(date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}
        ]
      };
      
      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching appointments by date. The error is:", error.message);
      return [];
    }
  },

  async getTodayAppointments() {
    const today = new Date().toISOString().split("T")[0];
    return this.getByDate(today);
  },

  async create(appointmentData) {
    try {
      const params = {
        records: [{
          patient_id_c: parseInt(appointmentData.patient_id_c),
          doctor_id_c: parseInt(appointmentData.doctor_id_c),
          department_id_c: appointmentData.department_id_c ? parseInt(appointmentData.department_id_c) : null,
          date_c: appointmentData.date_c,
          time_c: appointmentData.time_c,
          reason_c: appointmentData.reason_c,
          notes_c: appointmentData.notes_c,
          status_c: "Scheduled",
          created_at_c: new Date().toISOString().split("T")[0]
        }]
      };
      
      const response = await apperClient.createRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating appointment. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in creating appointment. The error is:", error.message);
      return null;
    }
  },

  async update(id, appointmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          patient_id_c: parseInt(appointmentData.patient_id_c),
          doctor_id_c: parseInt(appointmentData.doctor_id_c),
          department_id_c: appointmentData.department_id_c ? parseInt(appointmentData.department_id_c) : null,
          date_c: appointmentData.date_c,
          time_c: appointmentData.time_c,
          reason_c: appointmentData.reason_c,
          notes_c: appointmentData.notes_c,
          status_c: appointmentData.status_c
        }]
      };
      
      const response = await apperClient.updateRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating appointment. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating appointment. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting appointment. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting appointment. The error is:", error.message);
      return { success: false };
    }
  },

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };
      
      const response = await apperClient.updateRecord('appointment_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating appointment status. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating appointment status. The error is:", error.message);
      return null;
    }
  }
};