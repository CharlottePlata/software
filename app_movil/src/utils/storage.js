import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map();
// respaldo temporal en memoria asi AsyncStorage 

//ejecuta una funcion async y si falla devuelve un valor or defecto
//se usa para centralizar el manejo silencioso de errores

async function safeCall(fn, fallbackValue) {
    try {
        return await fn();
    } catch {
        return fallbackValue;
    }
}
//lee una clave de almacenamiento 
//primero intenta por AsyncStorage y si falla usa el respaldo de memoria
export async function storageGetItem(key) {
    const value = await safeCall(() => AsyncStorage.getItem(key), null);
    if (value !== null) {
        return value;
    }
    return memoryStore.has(key) ? memoryStore.get(key) : null;
}

// guardar una clave en AsyncStorage 
// si no puede persistir la almacena en la memoria virtual
export async function storageSetItem(key, value) {
    const ok = await safeCall(async () => {
        await AsyncStorage.setItem(key, value);
        return true;
    }, false);
    if (ok) {
        memoryStore.set(key, value);
    }
}

// elimina varias claves a la vez 
// siempre limpia primero el respaldo en memoria y luego intenta en asyncstorage
export async function storageMultiRemove(keys) {
    keys.forEach((key) => memoryStore.delete(key));
    await safeCall(async () => {
        await AsyncStorage.multiRemove(keys);
    }, null);
}

// alias de compatibilidad para codigo que ya usa el nombre anterior
export const storageRemoveItem = storageMultiRemove;