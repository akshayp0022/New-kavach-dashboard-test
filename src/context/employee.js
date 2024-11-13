import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/endpoints";
import { useAuth } from "../context/auth";

const EmployeeContext = createContext();

export const useEmployeeContext = () => {
  return useContext(EmployeeContext);
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/user/alluser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data.data);
      console.log("Employees fetched successfully:", response.data);
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
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <EmployeeContext.Provider
      value={{ employees, loading, error, fetchEmployees }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
