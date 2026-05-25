/**
 * Encapsula las operaciones del panel administrativo sobre productos 
 * crea, edita, elimina,activa/desactiva productos
 * todas las funciones del cliente http central para incluir token
 * y manejo de errores
 */

import api from '../api/apiClient';

// crear un producto en el backend usando FormData para ser compatible con multer
export async function createProduct(data) {
    // si ya es FormData, enviarlo tal cual
    let payload = data;
    if (!(data instanceof FormData)) {
        const form = new FormData();
        // campos simples
        const fields = ['nombre', 'descripcion', 'precio', 'stock', 'categoriaId', 'subcategoriaId'];
        fields.forEach((f) => {
            if (data[f] !== undefined && data[f] !== null) {
                form.append(f, String(data[f]));
            }
        });

        // imagen: puede ser una URL string o un objeto { uri, name, type }
        if (data.imagen) {
            if (typeof data.imagen === 'string') {
                // si backend acepta un string con la URL
                form.append('imagen', data.imagen);
            } else if (data.imagen.uri) {
                const img = data.imagen;
                const name = img.name || (img.uri && img.uri.split('/').pop()) || 'photo.jpg';
                const type = img.type || 'image/jpeg';
                form.append('imagen', { uri: img.uri, name, type });
            } else {
                // fallback: añadir como string
                form.append('imagen', String(data.imagen));
            }
        }

        payload = form;
    }

    const res = await api.post('/admin/productos', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}


// actualizar el backend usando el payloand del formulario del admin
export async function updateProduct(id, data) {
    let payload = data;
    if (!(data instanceof FormData)) {
        const form = new FormData();
        const fields = ['nombre', 'descripcion', 'precio', 'stock', 'categoriaId', 'subcategoriaId'];
        fields.forEach((f) => {
            if (data[f] !== undefined && data[f] !== null) {
                form.append(f, String(data[f]));
            }
        });
        if (data.imagen) {
            if (typeof data.imagen === 'string') {
                form.append('imagen', data.imagen);
            } else if (data.imagen.uri) {
                const img = data.imagen;
                const name = img.name || (img.uri && img.uri.split('/').pop()) || 'photo.jpg';
                const type = img.type || 'image/jpeg';
                form.append('imagen', { uri: img.uri, name, type });
            } else {
                form.append('imagen', String(data.imagen));
            }
        }
        payload = form;
    }

    const res = await api.put(`/admin/productos/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}


// elimina un producto en el backend
export async function deleteProduct(id) {
    const res = await api.delete(`/admin/productos/${id}`);
    return res.data;
} 

// Marca activado el producto
export async function activarProducto(id) {
    const res = await api.patch(`/admin/productos/${id}/toggle`);
    return res.data;
}

// marca desactivado el producto
export async function desactivarProducto(id) {
    const res = await api.patch(`/admin/productos/${id}/toggle`);
    return res.data;
}
