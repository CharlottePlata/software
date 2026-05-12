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
// ThemedText: texto que aplica colores del tema del dispositivo (claro/oscuro)
import { ThemedText } from '@components/themed-text';
//themedView: color de fondo  automatico segun el tema del dispositivo
import { ThemedView } from '@components/themed-View'; 