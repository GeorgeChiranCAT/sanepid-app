// src/hooks/useAuth.js - Update the logout method
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;