
/**
 * Este archivgestion de usuarios para el panel de administracion
 * lista todos los usuarios del sistema con nombre, email, rol y estado
 * permite buscar usuario por texto y navegar entre paginas  10 por pagina
 * solo adminis pudee activar, desactivar y eliminar usuarios
 * los auxiliares puede ver la lista pero son botones de accion
 * esta pantalla es con rutas protegidas por api/admin/usuarios
 */


// manejo de variables de estoado local
import {useEffect, useState} from 'react';
// importar componentes
//  Dimensions optiene al ancho y alto de la pantalla para hacer diseños responsivos
// flatlist lista optimiza con virtializacion para mostrar grandes cantidades de datos
// modal mostrar detalles de contenido en ventana emergente
import { 
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable, 
    StyleSheet, 
    TextInput,
        View} from "react-native";

//lee los parametros de la url para obtener el id del pedido
import { ThemedText } from '@/components/themed-text';

import apiClient  from '../../src/api/apiClient';
import { activarUsuario,desactivarUsuario,deleteUsuario} from '../../src/services/usuarioAdminService';
import { useAuth } from '../../src/context/AuthContext';

/**
 * Tipos
 * Estrucutra minima de un usuario para mostrar en la lista
 */
type Usuario= {
    id?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    rol?: string; // administrador, / auxiliar/ cliente
    activo?: string; // true puede iniciar sesion
}

// solo necesitamos el rol del administrador autenticado
type AuthUser = {
    rol?:string;
};

/**
 * Componente principal
 */
export default function AdminUsuariosScreen(){
    //contexto de autenticacion
    const {user}= useAuth() as {user: AuthUser | null};

    // Estado local 

    const [usuarios, setUsuarios] = useState<Usuario[]>([]); //usuario de pagina actual
    const [loading, setLoading] = useState(true); //indicador de carga
    const [errorMessage, setErrorMessage] = useState(''); // mensaje de error
    const [busqueda, setBusqueda] = useState(''); // texto de busqueda
    const [pagina, setPagina] = useState(1); // pagina actual
    const [totalPaginas, setTotalPaginas] = useState(1); // total de paginas disponibles

    /**
     * Fucion de fetchUsuarios
     * consulta get/admin/usuarios con filtro de busqueda y paginacion
     * page pagina a cargar.  search  texto de filtro 
     */

    const fetchUsuarios = async (page = 1, search = '') => {
        setLoading(true);
        setErrorMessage('');
        try{
            //const
        }
    }

}