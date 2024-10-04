import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/index";
import { useAuth } from "../context/auth";

const EmployeeContext = createContext();

export const useEmployeeContext = () => {
  return useContext(EmployeeContext);
};

export const EmployeeProvider = ({ children }) => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/user/alluser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      setEmployees(response.data.data );
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token]);

  return (
    <EmployeeContext.Provider value={{ employees, loading, error }}>
      {children}
    </EmployeeContext.Provider>
  );
};
