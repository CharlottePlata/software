
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
import {router} from "expo-router"; // navegacion y parametros de rute
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

export default function AdminProductoForm() {
    /**
     * navegacion
     * use Router permite navegar programaticamente 
     */
    const router = useRouter();
    /**
     * Parametros de ruta
     * el parametro producto e opcional solo existe modo editar
     *  expo Router son String
     */
    const params = useLocalSearchParams<{producto?:string}>();
    
    /**
     * Producto recibido
     * si exites el parametro intenta pasearlo como json
     * si falla el parse (JSON mal formado),lo deja como undefined ( modo creacion) 
     */
    let producto: Producto | undefined;
    if(params.producto){
        try{
            producto = JSON .parse(params.producto) as Producto;
        } catch {
            producto = undefined; // fallo silecioso se trata con formulario vacio
        }
    }
    /**
     * modo  formulario
     * editing = true modo edicion(producto recibido)
     * editing =  false modo creacion
     */
    const editing = !!producto;

    /**
     * Estado local campos del formulario
     * los campos se inicializan con los valores del producto si se esta editando
     * o en cadena si vacia se esta creando
     * El operador ?? devuelve el lado derecho solo si el izquierdo no es null/ undefined
     */

    const [nombre, setNombre] = useState(producto?. nombre ?? '');
    const [descripcion, setDescripcion] = useState(producto?. descripcion ?? '');
    // precio y stock guarda como trin para facilitar la entrada en el TextInput, se convierten a numero al guardar
    const [precio, setPrecio] = useState(producto?. precio?. toString() ?? ''); // convertir a string para el input
    const [stock, setStock] = useState(producto?. stock?.toString() ?? ''); // convertir a string para el input
    const [imagen, setImagen] = useState(producto?. imagen ?? '');
    const [loading, setLoading] = useState(false); // estado de carga para evitar multiples envios

    /**
     * Funcion hadlwsunait
     * vslida los campos al servicio correspondiente (crear o actualizar)
     * y Resgreos de la pantalla anteriror si fue ecitoso
     */
    const handleSubmit = async () => {
        // validacion basica los 4 campos obligatorios no puden estar vacios
        if(!nombre || !descripcion || !precio || !stock){
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        setLoading(true); // Deshanbilita el boton durante a la peticion
        try{
            // construye el objeto de datos convertiendo precio y stock a numero
            const data = {
                nombre,
                descripcion,
                precio: parseFloat(precio), // convertir a numero
                stock: parseInt(stock, 10), // convertir a numero entero
                imagen,
            };
            if (editing && producto?.id){
                // mod edicion llama a updateProduct con el id  del producto
                // se usa el operador de propagacion para incluir el id en el objeto de datos
                await updateProduct(producto.id || producto.id, data);
                Alert.alert('Éxito', 'Producto actualizado correctamente');
            }else{
                //cuando el formulario esta vacio se comporta como creacion
                await createProduct(data);
                Alert.alert('Exito','Producto creado');
            }
            router.back(); // regresa a /admin/prodcutos despues de guardar
        } catch {
            // si 
            Alert.alert('Error', 'No se puedo guardar el producto')
        } finally {
            setLoading(false); // habilita el boton nuevamente
        }
    }

}

