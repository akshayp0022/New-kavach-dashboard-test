import axios from "../utils/endpoints";

const token = sessionStorage.getItem("token") || undefined;

export const fetchEmailSettings = async (employeeId) => {
  try {
    const response = await axios.get(
      `/email/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching email settings:", error);
  }
};

export const createEmailSettings = async (employeeId, settings) => {
  try {
    await axios.post(
      `/createEmail/${employeeId}`,
      settings,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Email settings created successfully");
  } catch (error) {
    console.error("Error creating email settings:", error);
  }
};

const updateEmailSettings = async (employeeId, updatedSettings) => {
  if (!employeeId) {
    console.error("employeeId is not defined");
    return;
  }

  if (!token) {
    console.error("No token found in state");
    return;
  }

  try {
    const response = await axios.put(
      `/updateEmail/${employeeId}`,
      updatedSettings,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating email settings:", error);
    return null;
  }
};

const deleteEmailSettings = async (employeeId) => {
  if (!employeeId) {
    console.error("employeeId is not defined");
    return;
  }

  if (!token) {
    console.error("No token found in state");
    return;
  }

  try {
    await axios.delete(`/deleteEmail/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Email settings deleted for employee ${employeeId}`);
  } catch (error) {
    console.error("Error deleting email settings:", error);
  }
};
