/**
 * Este archivoy y de pedidos del cliente
 * solo es tuta dinamiaca por que se opyine i peiddo por su si Y  usl carga le 
 * pedidos del cliente y muestra los detalles de cada pedido en una modal 
 * 
 */
// manejo de variables de estoado local
import {useState, useEffect, useMemo, use} from 'react';
// importar componentes
//  Dimensions optiene al ancho y alto de la pantalla para hacer diseños responsivos
// flatlist lista optimiza con virtializacion para mostrar grandes cantidades de datos
// modal mostrar detalles de contenido en ventana emergente
import { 
    ActivityIndicator, 
    Image,
    Pressable,
    ScrollView, 
    StyleSheet, 
    TextInput } from "react-native";

//lee los parametros de la url para obtener el id del pedido
import { router, useLocalSearchParams } from 'expo-router';
// ThemedText: texto que aplica colores del tema del dispositivo (claro/oscuro)
import { ThemedText } from '@components/themed-text';
import {  ThemedView} from '@components/themed-view';  
//cliente http axios con jWT
import pedidoService from '../../src/services/pedidoService';
type ProductoDetalle = {
  nombre?: string;
  imagen?: string;
}
type Detalle = {
  id:number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: ProductoDetalle; // detalle del producto en memoria cache
  Producto?: ProductoDetalle; // detalle del producto en respuesta del backend
};

// escructura princiapl del pedido mostrar en la pantalla
  type Pedido ={
    id: string;
    estado: string;
    createdAt?: string;
    direccion?: string;
    telefono?: string;
    metodoPago?: string;
    total?: number;
    detalles: Detalle[]; // variable de tipo array de detalles del pedido
    DetallesPedido?: Detalle[]; // detalles el pedido desde el bakend

  };

  /**
   * helpers para formatear fecha y el estado del pedido
   */

  // fromatea un numero como pesos colombianos
  function formatCOP(value: number | undefined ): string {

    return`$${Number(value || 0).toLocaleString('es-CO')}`

  }
  // convierte una fecha ISo a formato legible en español (colombia)
  function formatDate(value: string | undefined): string {
    if (!value){
      return '';
    }

    return new Date(value).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // traduce estados tecnicos del backend a tiquetas amigables para el usuario
  function mapEstadoLabel(value: string | undefined): string {
    const labels: Record<string, string> ={
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      en_proceso: 'En proceso',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };

    //Prioridad: etiqueta mapeada -> Valor original -> texto de defecto
    return labels[value || ''] || value || 'Pendiente';
  }

  /**
   * Componente principal
   */

  export default function PedidoDetalleScreen() {
    // lee el parametro dinamico [id] desde la url .
    const {id}= useLocalSearchParams();
    //Normaliza por si Expo Router devuleve arrglos
    const pedidoId = Array.isArray(id) ? id[0] : id;

    //Estado local
    const[pedido, setPedido] = useState<Pedido | null>(null);
    const[loading, setLoading] = useState<boolean>(true);
    const[errorMessage, setErrorMessage] = useState('');
    const[isCancelled, setIsCancelled] = useState(false);
  }
