const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const doctorService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_status_c"}},
          {"field": {"Name": "license_number_c"}},
          {"field": {"name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('doctor_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching doctors. The error is:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "availability_status_c"}},
          {"field": {"Name": "license_number_c"}},
          {"field": {"name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('doctor_c', parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`apper_info: An error was received in fetching doctor ${id}. The error is:`, error.message);
      return null;
    }
  },

  async getByDepartmentId(departmentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "availability_status_c"}}
        ],
        where: [
          {"FieldName": "department_id_c", "Operator": "EqualTo", "Values": [parseInt(departmentId)]}
        ]
      };
      
      const response = await apperClient.fetchRecords('doctor_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching doctors by department. The error is:", error.message);
      return [];
    }
  },

  async create(doctorData) {
    try {
      const params = {
        records: [{
          name_c: doctorData.name_c,
          specialization_c: doctorData.specialization_c,
          department_id_c: parseInt(doctorData.department_id_c),
          phone_c: doctorData.phone_c,
          email_c: doctorData.email_c,
          availability_status_c: "Available",
          license_number_c: doctorData.license_number_c
        }]
      };
      
      const response = await apperClient.createRecord('doctor_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating doctor. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in creating doctor. The error is:", error.message);
      return null;
    }
  },

  async update(id, doctorData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: doctorData.name_c,
          specialization_c: doctorData.specialization_c,
          department_id_c: parseInt(doctorData.department_id_c),
          phone_c: doctorData.phone_c,
          email_c: doctorData.email_c,
          availability_status_c: doctorData.availability_status_c,
          license_number_c: doctorData.license_number_c
        }]
      };
      
      const response = await apperClient.updateRecord('doctor_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating doctor. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating doctor. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('doctor_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting doctor. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting doctor. The error is:", error.message);
      return { success: false };
    }
  }
};