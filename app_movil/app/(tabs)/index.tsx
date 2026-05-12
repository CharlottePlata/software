/**
 * Pantalla de cuenta pestaña 1
 * pantalla principal tienda muestra el catalogo de productos
 * con un banner hero tarjetas de caracteristicas buscador de texto
 * chips de categoria  lista de productos a 2 columnas paginas y
 * modal de detalle producto
 */

/**importar componetes de react native para construir la pantalla
 * hook de react:
 * useEffect ejecuta el codigo al montar el componente o cuando cambian las dependencias
 * useMemo memoriza valores calculados para evitar recalculos innecesarios
 * useState maneja variables de estado local
*/
// manejo de variables de estoado local
import {useState, useEffect, useMemo} from 'react';
// importar componentes
//  Dimensions optiene al ancho y alto de la pantalla para hacer diseños responsivos
// flatlist lista optimiza con virtializacion para mostrar grandes cantidades de datos
// modal mostrar detalles de contenido en ventana emergente
import { 
    ActivityIndicator, 
    Alert,
    Dimensions, 
    FlatList,
    Modal,
    Image,
    Pressable, 
    RefreshControl,
    ScrollView, 
    StyleSheet, 
    TextInput,
     View } from "react-native";

//Ionicons libreria de iconos vectoriales para react native
import {Ionicons} from "@expo/vector-icons";
//CatalogoService servicio que hace las llamadas a (API) del backend para productosy categorias
import catalogoService  from "../../src/services/catalogoService";
// ThemedText: texto que aplica colores del tema del dispositivo (claro/oscuro)
import { ThemedText } from '@components/themed-text';
//themedView: color de fondo  automatico segun el tema del dispositivo
import { ThemedView } from '@components/themed-View'; 
// useCarrito hook el contexto del carrito para agregar productos
import { useCarrito } from '../../src/context/CarritoContext';

/**
 * Tipo Carrito CTX
 * describe los campos que se usan de useCarrito en pantalla
 */

type CarritoCTX= {
    //  agregarProducto: agrega producto al carrito con la cantidad indicada
    agregarProducto:(idProducto:number, cantidad:number) => Promise <void>;
    // totalItems numero total de items en el carrito
};

/**
 * constantes globales
 * se calculan uno sola vez al cargar el modulo 
 */

// SREEN_WIDTH  ancho de dispositivo en dp ( density independent pixels) para diseños responsivos
const {width: SCREEN_WIDTH} = Dimensions.get('window');
// Card_gap espacio horizontaL entre las 2 columnas de la tarjeta de produto
const CARD_GAP = 10;
// CARD_WIDTH ancho de cada tarjeta calculando para que quepan excatamente 2 por fila de dos columna
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;
// ITEMS_POR_PAGINA numero de productos por pagina usando paginacion
const ITEMS_POR_PAGINA = 15;


