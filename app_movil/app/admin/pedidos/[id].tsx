/**
 * Este archivoy pantalla de detalle de un pedido  especifico para el administrador
 * recibe el parametro dinamico id desde la url
 * consulta el backend para trear los datos del pedido
 * muestra los datos del cleinte estado actual total fecha y lista de productos
 * permite cambiar el estado el pedido pentiente -> enviado -> entregado o cancelar si esta en pendiente
 */

// manejo de variables de estoado local
import {useState, useEffect, useMemo, use} from 'react';
// importar componentes
//  Dimensions optiene al ancho y alto de la pantalla para hacer diseños responsivos
// flatlist lista optimiza con virtializacion para mostrar grandes cantidades de datos
// modal mostrar detalles de contenido en ventana emergente
import { 
    ActivityIndicator, 
    Alert,
    Pressable, 
    RefreshControl,
    ScrollView, 
    StyleSheet, 
    TextInput,
     View } from "react-native";

//lee los parametros de la url para obtener el id del pedido
import {useLocalSearchParams} from "expo-router";
// ThemedText: texto que aplica colores del tema del dispositivo (claro/oscuro)
import { ThemedText } from '@components/themed-text';
//cliente http axios con jWT
import apiClient from '../../../src/api/apiClient';

/**
 * TIPOS
 * representa in item de ls lista de productos del pedido
 * todos los campos son opcionales ? porque el backend pueden enviarlos todos
 */

type Detalle = {
    productos?: {nombre?: string}; //solo del los productos comprados
    cantrridadr?: number;
    precio?: number; // precio unitario de producto
};

// representa el pedido completo tal como lo devuelve el backend
type Pedido = {
    id: string;
    estado?:string;
    total?: number;
    createdAt?: string;
    usuario?:{
        nombre?: string;
        apellido?: string;
        email?: string;
    };
    detalles?: Detalle[]; // arreglo de productos incluidos en el pedido
};

/**
 * Componente principal
 */
export default function AdminPedidoDetalleScreen(){
    /**
     * parametros de ruta
     * useLocalSearchParams lee lo segmentos de dinamicos de la url
     * como el archivo se llama [id].tsx el parametro se llama id es
     * decir si un pedido se llama 39 el id es 38
     */

    const {id} = useLocalSearchParams<{id: string}>();

    // estado local
    const [pedido,setPedido] = useState<Pedido | null>(null);
    //datos del pedido. null= aun no cargado
    const [loading, setLoading] = useState(false);
    //activo miestras de hace pa peticiones api
    const [errorMessage, setErrorMessage] = useState('');
    //Mensaje de error si falla la carga
    const [cambiando,setCambiando] = useState(false);
    // true miestras se esta cambiando el estado de eviado el doble click

    /**
     * funcion  fetchPedido
     * llama el endopoint ger/admin/pedidos/:id y guarda el resultado en estado
     * se usa tanto en el montaje inicial useEffect como despues de cambiar el estado
     */

    const fetchPedido = async () => {
        setLoading(true); //muestra el spinner
        setErrorMessage('');
        try{
            //peticion get autenticada el token JWTlo agrega el cliente apiClient automaticamente
            const res = await apiClient.get(`/admin/pedidos/${id}`);
            //la respuesta tiene estructura {data: data: {pedido...
            // el operador ? evita errores si algun nivel es undefined
            setPedido(res.data?.data?.pedido || null);
            }catch (error:unknown){
                // si la peticion falla guardar el mensaje de error para mostrarlo en la pantalla
                setErrorMessage((error as {message?:string})?.message || 'no se ouede cargar el pedido'); 
            }finally{
                setLoading(false); //oculta el spinner
            }
        };
        
        /**
         * efecto carga inicial se ejecuta cada vez que cambie el parametroid de la url
         * en la practica solo se ejecuta el mostrar por que no se navega en tres ids diferentes
         */

        useEffect(()=>{
            fetchPedido();
            /**
             * eslint-disable-next-line react-hooks/exhaustive-deps
             * fechPedido no se incluye en el array de dependencias para evitar bucles infinitos
             * el lint warning se suprime con el comentario de arriba
             */
        }, [id]);

        /**
         * funcion cambiar estado
         * evita un PATCH al backend para actualizar el estado del pedido
         * parametro: nuevoEstado el estado al que se requiere transicionar
         * eviando, entregado o cancelado
         */
        const cambiarEstado = async ( nuevoEstado: string) => {
            setCambiando(true); //bloquea los botones para evitar multiples
            try{
                //PATCH/admin/pedidos/:id/estado con el nuvo estado en el body
                await apiClient.patch(`/admin/pedidos/${id}/estado`, {estado: nuevoEstado});
            }catch{
                // si falla muestra un alert nativo con el mensaje de error
                Alert.alert('Error', 'No se pudo cambiar el estado del pedido');
            }finally{
                setCambiando(false); //desbloquea los botones
            }
        };
    }
}