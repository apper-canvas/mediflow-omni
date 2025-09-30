const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const medicalRecordService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "appointment_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching medical records. The error is:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "appointment_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('medical_record_c', parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`apper_info: An error was received in fetching medical record ${id}. The error is:`, error.message);
      return null;
    }
  },

  async getByPatientId(patientId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}
        ],
        orderBy: [{"fieldName": "visit_date_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching medical records by patient. The error is:", error.message);
      return [];
    }
  },

  async create(recordData) {
    try {
      const params = {
        records: [{
          patient_id_c: parseInt(recordData.patient_id_c),
          doctor_id_c: parseInt(recordData.doctor_id_c),
          appointment_id_c: recordData.appointment_id_c ? parseInt(recordData.appointment_id_c) : null,
          visit_date_c: recordData.visit_date_c || new Date().toISOString().split("T")[0],
          chief_complaint_c: recordData.chief_complaint_c,
          diagnosis_c: recordData.diagnosis_c,
          treatment_c: recordData.treatment_c,
          notes_c: recordData.notes_c
        }]
      };
      
      const response = await apperClient.createRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating medical record. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in creating medical record. The error is:", error.message);
      return null;
    }
  },

  async update(id, recordData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          visit_date_c: recordData.visit_date_c,
          chief_complaint_c: recordData.chief_complaint_c,
          diagnosis_c: recordData.diagnosis_c,
          treatment_c: recordData.treatment_c,
          notes_c: recordData.notes_c
        }]
      };
      
      const response = await apperClient.updateRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating medical record. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating medical record. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting medical record. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting medical record. The error is:", error.message);
return { success: false };
    }
  }
};