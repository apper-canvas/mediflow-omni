const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const departmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "extension_c"}},
          {"field": {"name": "head_doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('department_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("apper_info: An error was received in fetching departments. The error is:", error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "extension_c"}},
          {"field": {"name": "head_doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('department_c', parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`apper_info: An error was received in fetching department ${id}. The error is:`, error.message);
      return null;
    }
  },

  async create(departmentData) {
    try {
      const params = {
        records: [{
          Name: departmentData.Name,
          description_c: departmentData.description_c,
          floor_c: departmentData.floor_c,
          extension_c: departmentData.extension_c,
          head_doctor_id_c: departmentData.head_doctor_id_c ? parseInt(departmentData.head_doctor_id_c) : null
        }]
      };
      
      const response = await apperClient.createRecord('department_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in creating department. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in creating department. The error is:", error.message);
      return null;
    }
  },

  async update(id, departmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.Name,
          description_c: departmentData.description_c,
          floor_c: departmentData.floor_c,
          extension_c: departmentData.extension_c,
          head_doctor_id_c: departmentData.head_doctor_id_c ? parseInt(departmentData.head_doctor_id_c) : null
        }]
      };
      
      const response = await apperClient.updateRecord('department_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in updating department. The response body is:", JSON.stringify(response));
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
      console.error("apper_info: An error was received in updating department. The error is:", error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('department_c', params);
      
      if (!response.success) {
        console.error("apper_info: An error was received in deleting department. The response body is:", JSON.stringify(response));
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error("apper_info: An error was received in deleting department. The error is:", error.message);
      return { success: false };
    }
  }
};