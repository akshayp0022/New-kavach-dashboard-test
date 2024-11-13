import React, { createContext, useContext, useState } from "react";
import axios from "../utils/endpoints";
import { useAuth } from "../context/auth";

const EmailContext = createContext();

export const useEmailContext = () => {
  return useContext(EmailContext);
};

export const EmailProvider = ({ children }) => {
  const { token } = useAuth();
  const [emailSettings, setEmailSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   const fetchEmailSettings = async (employeeId) => {
//     if (!employeeId) {
//       console.error("employeeId is not defined");
//       return {};
//     }
  
//     // Return cached settings if already fetched
//     if (emailSettings[employeeId]) {
//       return emailSettings[employeeId];
//     }
  
//     if (!token) {
//       console.error("No token found in state");
//       return {};
//     }
  
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:4001/api/getEmail/${employeeId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       console.log("response", response.data);
  
//       // Check if the response contains data
//       if (!response.data || Object.keys(response.data).length === 0) {
//         console.warn("No email settings found for employeeId:", employeeId);
  
//         setEmailSettings((prevSettings) => ({
//           ...prevSettings,
//           [employeeId]: null, 
//         }));
  
//         return null; 
//       }
  
//       setEmailSettings((prevSettings) => ({
//         ...prevSettings,
//         [employeeId]: response.data,
//       }));
  
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching email settings:", error);
//       setError(error);
//       return {};
//     } finally {
//       setLoading(false);
//     }
//   };

  const createEmailSettings = async (employeeId, settings) => {
    if (!employeeId) {
      console.error('employeeId is not defined');
      return;
    }

    if (!token) {
      console.error('No token found in state');
      return;
    }

    try {
      await axios.post(
        `/createEmail/${employeeId}`,
        settings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Email settings created for employee ${employeeId}`);
    } catch (error) {
      console.error('Error creating email settings:', error.response ? error.response.data : error.message);
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
      setLoading(true);
      const response = await axios.put(
        `/updateEmail/${employeeId}`,
        updatedSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmailSettings((prevSettings) => ({
        ...prevSettings,
        [employeeId]: response.data,
      }));
      
      return response.data; 
    } catch (error) {
      console.error("Error updating email settings:", error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
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
        await axios.delete(
          `/deleteEmail/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(`Email settings deleted for employee ${employeeId}`);
      } catch (error) {
        console.error('Error deleting email settings:', error);
      }
}


  return (
    <EmailContext.Provider value={{ emailSettings, createEmailSettings, updateEmailSettings, deleteEmailSettings,loading, error }}>
      {children}
    </EmailContext.Provider>
  );
};
