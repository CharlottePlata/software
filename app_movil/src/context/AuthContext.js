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

    /**
     * restoreSession
     * lee el token y el usuario guardados en AsyncStorage al iniciar la app
     * si no hay sesion guardada, deja los estados en null
     */

    const restoreSession = useCallback (async () => {
        try{
            const sesion = await authService.getSession();
            setUser(sesion?.user || null);
            setToken(sesion?.token || null);
        } finally{
            // siempre marca la carga como terminada, aun que falle la lectura 
            setIsloadingSession(false);
        }
    },[]);
    
    //se ejecuta uns sola vez al montar el provider (Al iniciar la app)
    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    /**
     * Login
     * llama el post/auth/login, guarda el token en asyncStorage y actualiza el estado
     * global para que toda la app sepa que el usuario esta logueado
     */

    const login = useCallback(async (email, password) => {
        const response = await authService.login(email, password);
        //el backend puede devolver el payload dentro de response.data o directo 
        const payload = response.data || response;

        setToken(payload.token || null);
        setUser(payload.user || null);

        return response;
    }, []);

    /**
     * register
     * Delega el registro al servicio; no inicia sesion automaticamente
     */

    const register = useCallback(async(data) => {
        return await authService.register(data);
    },[]);

    /**
     * logout
     * Actualizar los datos de usuario en el backend y sicroniza el estado actual
     */

    const logout = useCallback(async () => {
        await authService.logout();
        setToken(null);
        setUser(null);
    },[]);
}