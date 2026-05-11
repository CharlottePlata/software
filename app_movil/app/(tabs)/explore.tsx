/**
 * pantalla de cuenta pestaña 3 a 2 metodos
 * no auetenticado muestrra fromulario de loagion y registro
 * auetenticado muestra perfil de ususario con opciones de editar datos
 * acceder al panel de admin/aux ver pedidos seung rol
 */

/**importar componetes de react native para construir la pantalla
 * ActivityIndicator,Spiner de carga circular
 * Alert, Dialogos emergentes nativos del sistema
 * Image, Muestra imagenes
 * Pressable, area tactil
 * ScrollView, contenedor de scroll vertical
 * StyleSheet, crea estilos de forma optimizada
 * Text, Muestra texto plano en la pantalla
 * View, contenedor generico equivale a un div en html y css
*/
// manejo de variables de estoado local
import {useState} from 'react';
// importar componentes
import { 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, 
    Pressable, 
    ScrollView, 
    StyleSheet, 
    Text,
    TextInput,
     View } from "react-native";

import {router} from 'expo-router';
//Ionicons libreria de iconos vectoriales para react native
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from '../../src/context/AuthContext';
//themedTexte: texto que aplica colores del tema edl dispositivo  de manejra automatica claro o oscuro
import { ThemedTexte } from '@components/themed-text';
//themedView: color de fondo  automatico segun el tema del dispositivo
import { ThemedView } from '@components/themed-View';

/**
 * AuthCtx: define la forma del objeto devuelto por useAuth es necesario
 * porque AuthContext.js esta en javascript no typescript y el copilador no los reconoce
 */

type AuthCtx = {
    //User datos del ususairo autenticado. null si no  inicio sesion
    user:{ nombre?: string, email?: string, rol?: string} | null;
    //isAuthenticated: true si sesion activa
    isAuthenticated: boolean;
    // isLoading: true miestras se verifica si hay sesion guardada al abrir la app
    isLoading: boolean;
    // login: funcion que recibe el email y contraseña  lanza error si falla
    login: (email:string, password:string) => Promise<unknown>;
    //  register funcion que registra u nuevo usuario lanza errror si falla
    register: (data: {nombre:string, apellido: string, email:string, password:string, 
        telefono?:string, direccion?:string}) => Promise<unknown>;
    //  logout: funcion que cierra la sesion  del ususaio
    logout: () => Promise<void>;
    // updateperfil: funcion que actualiza los datos del usuario
    updatePerfil: (data: {nombre?:string, email?:string, password?:string
         }) => Promise<unknown>;
};

//roiuter navega apilando ña nueva pantall permite volver atras con la opcion de atras
// se usa as unknown as para evitar errores de typescript cone contextos router

const routerPush = (path: string) => (router as unknown as {push: (p:string) => void}).push(path);

// component principal del tab de cuenta
export default function TabTwoScreen(){
    //  estado del formulario loagion y registro
    // isRegisterMode true mostrar formulario de registro false mostrar login
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    //camposdel formulario de registroy login
    const [nombre, setNombre] =useState('');
    const [apellido, setApellido] =useState('');
    const [email, setEmail] =useState('');
    const [password, setPassword] =useState('');
    const [confirmPassword, setConfirmPassword] =useState('');
    const [telefono, setTelefono] =useState('');
    const [direccion, setDireccion] =useState('');
    // loadingSubmit true miestras se procesa el login o registro evita el doble envio
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    //  mensaje del retroalimentacion al usuario (error o exito)
    const [errorMensaje, setErrorMensaje] =useState('');
    const [successMensaje, setSuccessMensaje] =useState('');

    // Estado de edicionde perfil
    // editMode true mostrar campos editables false modo lectura
    // crear constates de di
}