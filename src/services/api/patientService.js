const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const patientService = {
  async getAll() {
    try {
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registration_date_c"}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(patient => ({
        ...patient,
        allergies_c: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : []
      }));
    } catch (error) {
      console.error("apper_info: An error was received in fetching patients. The error is:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
{"field": {"Name": "allergies_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registration_date_c"}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('patient_c', parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return {
        ...response.data,
        allergies_c: response.data.allergies_c ? response.data.allergies_c.split(',').map(a => a.trim()) : []
      };
    } catch (error) {
      console.error(`apper_info: An error was received in fetching patient ${id}. The error is:`, error.message);
      return null;
    }
  },

  async create(patientData) {
    try {
      const params = {
records: [{
          first_name_c: patientData.first_name_c,
          last_name_c: patientData.last_name_c,
          date_of_birth_c: patientData.date_of_birth_c,
          age_c: parseInt(patientData.age_c),
          gender_c: patientData.gender_c,
          blood_group_c: patientData.blood_group_c,
          phone_c: patientData.phone_c,
          email_c: patientData.email_c,
          address_c: patientData.address_c,
          emergency_contact_c: patientData.emergency_contact_c,
          emergency_phone_c: patientData.emergency_phone_c,
          allergies_c: Array.isArray(patientData.allergies_c) ? patientData.allergies_c.join(',') : patientData.allergies_c,
          status_c: "Active",
          registration_date_c: new Date().toISOString().split("T")[0],
          doctor_id_c: patientData.doctor_id_c ? parseInt(patientData.doctor_id_c) : undefined
        }]
      };
      
      const response = await apperClient.createRecord('patient_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating patient. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in creating patient. The error is:", error.message);
      return null;
    }
  },

  async update(id, patientData) {
    try {
      const params = {
records: [{
          Id: parseInt(id),
          first_name_c: patientData.first_name_c,
          last_name_c: patientData.last_name_c,
          date_of_birth_c: patientData.date_of_birth_c,
          age_c: parseInt(patientData.age_c),
          gender_c: patientData.gender_c,
          blood_group_c: patientData.blood_group_c,
          phone_c: patientData.phone_c,
          email_c: patientData.email_c,
          address_c: patientData.address_c,
          emergency_contact_c: patientData.emergency_contact_c,
          emergency_phone_c: patientData.emergency_phone_c,
          allergies_c: Array.isArray(patientData.allergies_c) ? patientData.allergies_c.join(',') : patientData.allergies_c,
          doctor_id_c: patientData.doctor_id_c ? parseInt(patientData.doctor_id_c) : undefined
        }]
      };
      
      const response = await apperClient.updateRecord('patient_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating patient. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating patient. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('patient_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting patient. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting patient. The error is:", error.message);
      return { success: false };
    }
  },

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "status_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "phone_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in searching patients. The error is:", error.message);
      return [];
    }
  }
};