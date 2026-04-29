// este archivo centraliza axios para todas las peticiones HTTP de backend
// Configuracion de url base y el tiempo maximo de espera desde las constantes
// intervceptor de peticion: adjunta automaticamente el token JWT si existe
// interceptor de respuesta: normaliza los errores para que todo el codigo reiba
// siempre un objeto de Error con un mensaje legible 
import axios from 'axios';
import {API_BASE_URL, API_TIMEOUT_MS, STORAGE_KEYS} from '../utils/constants';
import {storageGetItem} from '../utils/storage';