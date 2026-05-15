
/**
 * Este archivo gestion de productos panel de administracion
 * lista de tod los productos del sisitema con imangen, descripcion precio y estado
 * permite busar el tiempo real y navega entre paginas 10 por pagina
 * producto-form con los datos de editar
 * al precionar el producto navega a sus caracateristicas y edicion
 * solo administracion isAdminpuede activar, desactivar y eliminar productos
 * El auxiliar solo puede ver y navegar
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
    Image,
    Pressable,
    ScrollView, 
    StyleSheet, 
    TextInput,
        View} from "react-native";

//lee los parametros de la url para obtener el id del pedido
import {router, useLocalSearchParams} from "expo-router"; // navegacion y parametros de rute
import { themedText } from '@/components/themed-text';
import apiClient  from '../../src/api/apiClient';
import { activarProducto,desactivarProducto,deleteProduct} from '../../src/services/adminService';
import { useAuth } from '../../src/context/AuthContext';
/**
 * Tipo de producto
 * estructura del producto recibido tal como veien del backend
 */

type Producto = {
    id?: string;
    nombre?: string;
    descripcion?: string;
    precio?: number;
    stock?: number;
    imagen?: string;
    activo?: boolean; 
};

type AuthUser = { rol?: string };

/**
 * helpers de navegacion
 * cats de router para navegacion con string simple sin parametros
 */
const push = (path: string) => (router as unknown as {push:(p: string)=> void}).push(path);

//cats de router para navegar con pathname + params ( para pasar el obejto a producto)
const pushParams = ( pathname: string, params: Record<string, string>) =>
(router as unknown as {push:(p: {pathname: string; params: Record<string, string>})=> void}). push({pathname, params})

export default function AdminProductosScreen() {
    /**
     * contexto de autenticacion 
     */
    const{user} = useAuth() as { user: AuthUser | null};
    /**
     * estado local
     */
    const [productos, setProductos]= useState<Producto[]>([]); // productos en la pagina actual
    const [loading, setLoading] = useState(false); // estado de carga para mostrar indicador
    const [errorMessage, setErrorMessage] = useState(''); 
    const [ busqueda, setBusqueda] = useState(''); // texto de busqueda en tiempo real
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1); // total de paginas para paginacion

    /**
     * Funcion fetchProductos
     * consulta get/admin/productos con filtro de busqueda y paginacion
     */
    const fechProductos = async (page = 1, serch = '') => {
        setLoading(true);
        setErrorMessage('');
            try{
                const params: string[] = [];
                if(serch.trim()) params.push(`Buscar=${encodeURIComponent(serch.trim())}`); 
                params.push(`Pagina=${page}`); // pagina actual
                params.push(`limite=10`); // 10 productos por pagina
                const url = `/admin/productos?${params.join('&')}`;
                const res= await apiClient.get(url);
                const productosData: Producto[] = res.data?.data?.productos || [];
                setPagina(page);
                setTotalPaginas(res.data?.data?.paginacion?.totalPaginas || 1);
            } catch (error: unknown) {
                setErrorMessage((error as {message?: string}).message || 'Error al cargar productos');
            } finally{
                setLoading(false);
            }
        };
        useEffect(() => {
            fechProductos(1,'');
        }, []); // se ejecuta una vez al montar el componente

        // avanza y retrocede paginas
        const handlePagina = (next: number)=> {
            const nueva = Math.max(1, Math.min(totalPaginas, pagina + next)); // asegura que la pagina este entre 1 y totalPaginas
            fechProductos(nueva, busqueda);
        };

        const isAdmin = user?.rol === 'administrador';
    }



