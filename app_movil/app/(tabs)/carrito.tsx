/**
 * Pnatall de carrito de compras y sus respectivas gestiones no requiere que se autenticado solo para hacer compras
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

import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {router} from 'expo-router';
//Ionicons libreria de iconos vectoriales para react native
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from '../../src/context/AuthContext';
import {useCarrito} from '../../src/context/CarritoContext';

// carritoctx define la forma de los datos que devuelve usecarrito
// TypeScript necesita esto porque Carritocontext.js esta en javaScript
type CarritoCtx ={
    //items lista de productos en el carrito 
    items:{ id: string, nombre?:string, precio?: number, cantidad:number, imagen?:string}[];
    //total suma total en pesos de colombianos de todos los items 
    total:number;
    //TotaL items number total de items del carrito
    totalItems: number;
    // loading true mientras el contexto carga los datos iniciales
    loading: boolean;
    //cambiar cantidad actualiza la cantidad de unproducto 
    cambiarCantidad: (id:string, cantidad:number) => Promise<void>;
    //eliminar item eliminar unproducto del carrito
    eliminarItem: (id:string) => Promise<void>;
    //vaciar carrito eliminar todos los productos del carrito
    vaciarCarrito:() => Promise<void>;
}

//HELPERS de navegacion
// expo Router tipifica router de forma extricta y expone .push/replace
//Directamente en typescript, se usa as unknwon as.. para forzar el tipo
//poder llamar a las funciones de navegacion sin errores de compilador

// routerPush navegando a una nueva pantalla apilandora es decir se puede volver atras
const routerPush = (path: string) => (router as unknown as {push:(p:string) => void}).push(path);
//routeeReplace navega a una pantalla remplzando la actual recuerda que se puede volver para atras
const routerReplace = (path: string) => (router as unknown as {replace: (p:string) => void}).replace(path);

//fmt: formatea un numero como precio en pesos colombianos eje fmt(15000) -> $15.000
const fmt = (n: number) => `$${Number(n).toLocaleString('es-CO')}`;

//componente principal carrito screen
export default function CarritoScreen(){
    //obtiene el contexto de auth solo si el usuario esta autenticado
    const {isAuthenticated} = useAuth() as {isAuthenticated: boolean};
    
    //Obtiene del contexto del carrito los datos y funciones necesarias
    // se usa as CArritoCtx porque el contexto esta en js y typescript no interfiere en tipos
    const {items, total, loading, cambiarCantidad, eliminarItem, vaciarCarrito} = useCarrito () as CarritoCtx;

    // pantalla de carga 
    // si el carrito aun esta cargando por ejemplo recuperando datos guardados
    //  se muestra un spiner centrado en lugar deol contenidp normal

    if(loading){
        return(
            <view style ={styles.centered}>
                {/**espiner circular  color indigo */}
                <ActivityIndicator size = "large" color ="#6366f1" />
                <text style={styles.loadingText}> Cargando Carrito ....</text>
            </view>
        );
    }

    // funcon handleIrACheckout o sea pagar
    // si el usuario no esta autenticado muestra el dialogo de inicio de sesion
    // ai esta autenticado navega directamente a la pantalla de pagos
    const handleIrACheckout = () => {
        if(!isAuthenticated){
            Alert.alert(
                'Iniciar Sesión',
                'Debes iniciar sesión para proceder al pago',
                [
                    // boton cancelar cierra el dialogosin hacer nada
                    {text: 'Cancelar', style: 'cancel'},
                    // boton iniciar sesion lleva a pestaña cuentaexplore.tsx
                    {text: 'iniciar Sesion', onPress: () => routerReplace('/tabs/explore')},
                ]
            );
            return; // sale de la funcion
        }
        // usario atenticado navegador a la pantalla de pago
        routerPush('/checkout');
    };
}