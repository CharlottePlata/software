/**
 * modifica el manejo del carrito para dos escenarios
 * usuario sin sesion carrito local asyncStorage
 * usuario autenticado carrito persisitido en el bakckend
 * tambien normaliza la estrutura de items y calcula totales para el contexto consuma siempre un formato consistente
 */

import apiClient from '../api/apiClient';
import { STORAGE_KEYS } from '../utils/constants';
import { storageGetItem, storageSetItem } from '../utils/storage';

// lee el carrito guardado localmente. si no existe o esta corrupto devuelve

async function readLocalCart() {
    const raw= await storageGetItem(STORAGE_KEYS.carritoLocal);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// guardar el carrito local completo remplazando el calor anterior
async function writeLocalCart(items) {
    await storageSetItems(STORAGE_KEYS.carritoLocal, JSON.stringify(items));
    
}

//convierte en diferentes formatos de items del backend/local a una estructura unica
function normalizeItem(item) {
    const producto = item.Producto || item.producto || {};
    const precio = Number(item.precio ?? item.precioUnitario ?? producto.precio ?? 0);
    const cantidad = Number (item.cantidad || 0);

    return{
        id:item.id,
        productoId: item.productoId ?? producto.id,
        nombre: item.nombre ?? producto.nombre ?? 'producto',
        imagen: item.imagen ?? producto.imagen ?? '',
        precio,
        cantidad,
        subtotal: precio * cantidad,
    };
}

//calcula resumen de carrito: items normalizados, cantidad total y monto total

function summarize(item){
    const normalized = item.map(normalizeItem);
    const totalItems = normalized.reduce((acc, item)=> acc + item.cantidad, 0);
    const total = normalized.reduce((acc, item) => acc + item.subtotal, 0);
    
    return{items: normalized, totalItems, total};
}

const carritoservice ={
    //obtiene el carrito desde el backend o desde el storage segun la sesion
    getCarrito: async (isAuthenticated) =>{
        if (isAuthenticated){    
            const response = await apiClient.get('/cliente/carrito');
            const payload = response.data?.data || response.data || {};
            const carrito = payload.carrito || {};
            const items = carrito.items || carrito.items || [];
            return summarize(items);
        }

        const localItems = await readLocalCart();
        return summarize(localItems);
    },

    // agrgar un producto al carrito correspondiente
    addToCarrito: async ({isAuthenticated, producto, cantidad = 1}) =>{
        if(isAuthenticated){
            await apiClient.post('/cliente/carrito',{
                productoId:producto.Id,
                cantidad
            });
            return
        }
        const localItems = await readLocalCart();
        const existing = localItems.find((items) => Number (item.productoId) === Number(producto.id));


        if(existing){
            existing.cantidad += cantidad;
        } else {
            localItems.push({
                id: Date.now()})
        }
    }
}