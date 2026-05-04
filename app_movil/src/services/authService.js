/**
 * Centraliza todas las funciones relacionadas con autenticacion 
 * inicia sesion guarda  token/usuario en almacenamiento local
 * cierra sesion eliminando datos
 * restaura la sesion guardar
 * actualizar el perfil del usuario autenticando
 */

import apiClient from '../api/apiClient';
import {STORAGE_KEY} from '../utils/constants';
import {storageGetItem, storageMultiRemove, storageSetItem} from '../utils/storage';

const authService = {
    // envia credenciales al backend y persiste el token + ususario si son validos
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', {email, password});
        const payload = response.data?.data || response.data;
        
        if (payload?.token){
            await storageSetItem(STORAGE_KEY.token, payload.token);
        }
        if (payload?.usuario){
            await storageSetItem(STORAGE_KEY.usuario, payload.usuario);
        }

        return payload;
    },


// registra un nuevo usuario en el backend; no inicia sesion automaticamente
    register: async (data) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

//cerra sesion eliminando el token y los datos del usuario del almacenamiento local
    logout: async () => {
        await storageMultiRemove([STORAGE_KEY.token,STORAGE_KEY.user]);
    },

    //lee el almacenamiento  local
    getSession: async () =>{
        const token = await storageGetItem(STORAGE_KEY.token);
        const userRaw = await storageGetItem(STORAGE_KEY.user);
        const user = userRaw ? JSON.parse(userRaw) : null;
        return {token, user};
    },

    //actualizar 
    // actualizar el backend usando el payloand del formulario del admin
    update: async (data) => {
        const response = await apiClient.put(`/auth/me`, data);
        const usuario = response.data?.data?.usuario || response.data.usuario|| null;
        
        if(usuario){
            await storageSetItem(STORAGE_KEY.user, JSON.stringify(usuario));
        }

        return response.data;
    },
};

export default authService;
