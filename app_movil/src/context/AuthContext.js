 /* Archivo contexto globar de autenticación 
 * restuara la sesion guardada al iniciar la app (token, usuario)
 * Expone las funciones de login,register, logout, actualizar perfil
 * cualquier componente que se necesite saber si el usuario esta logueado usa un hook useAuth() en lugar de leer el AysncStorage directamente
 */

import  { createContext, useState, useEffect } from 'react';

import AsyncStorage from '../services/AsyncStorage';

// valor inicial null; useAuth() valida que esta dentro del provider
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Usuario autenticado objetivo de id:, nombre, rol o null
    const[user,setUser] = useState (null);
    //JWT recibido del backend; su precencia indica sesion activa
    const[token,setToken] = useState (null);
    // true miesntras se lee AsyncStorage al arrancar;
    //evita redirigir antes de tiempo
    const[loading,setLoading] = useState (true);

}