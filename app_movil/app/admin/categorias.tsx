import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import apiClient from '../../src/api/apiClient';
import { useAuth } from '../../src/context/AuthContext';

type Categoria = { id?: number; nombre?: string; descripcion?: string; activo?: boolean };

export default function AdminCategoriasScreen(){
  const { user } = useAuth() as { user: { rol?: string } | null };
  const isAdmin = user?.rol === 'administrador';
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // inline edit, no router navigation required
  const [editingId, setEditingId] = useState<number|undefined>(undefined);

  const fetchCategorias = async ()=>{
    setLoading(true);
    try{
      const res = await apiClient.get('/admin/categorias');
      const data = res.data?.data?.categorias || [];
      setCategorias(Array.isArray(data)? data: []);
    }catch(err){
      Alert.alert('Error', (err as Error).message || 'No se pudieron cargar categorías');
    }finally{setLoading(false)}
  };

  useEffect(()=>{ fetchCategorias(); },[]);

  const handleSave = async ()=>{
    if (!isAdmin) return Alert.alert('Acceso restringido', 'Solo el administrador puede crear o editar categorías');
    if(!nombre.trim()) return Alert.alert('Validación','El nombre es obligatorio');
    setSaving(true);
    try{
      if (editingId) {
        await apiClient.put(`/admin/categorias/${editingId}`, { nombre: nombre.trim(), descripcion });
      } else {
        await apiClient.post('/admin/categorias', { nombre: nombre.trim(), descripcion });
      }
      setNombre(''); setDescripcion(''); setEditingId(undefined);
      fetchCategorias();
    }catch(err){ Alert.alert('Error', (err as Error).message || 'No se pudo guardar'); }
    finally{ setSaving(false); }
  };

  const handleToggle = async (id?: number)=>{
    if (!isAdmin) return Alert.alert('Acceso restringido', 'Solo el administrador puede activar o desactivar categorías');
    if(!id) return;
    try{
      await apiClient.patch(`/admin/categorias/${id}/toggle`);
      fetchCategorias();
    }catch(err){ Alert.alert('Error', (err as Error).message || 'No se pudo cambiar estado'); }
  };

  const handleDelete = (id?: number)=>{
    if(!id) return;
    Alert.alert('Acceso restringido', 'No tiene permitido eliminar');
  };

  const renderItem = ({item}:{item:Categoria}) => (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <ThemedText type="defaultSemiBold">{item.nombre}</ThemedText>
        <ThemedText>{item.descripcion}</ThemedText>
      </View>
      <View style={styles.actions}>
        {isAdmin ? (
          <>
            <Pressable style={styles.btn} onPress={()=> { setNombre(item.nombre || ''); setDescripcion(item.descripcion || ''); setEditingId(item.id); }}>
              <ThemedText>Editar</ThemedText>
            </Pressable>
            <Pressable style={[styles.btn, {backgroundColor: item.activo? '#f97373': '#34d399'}]} onPress={()=> handleToggle(item.id)}>
              <ThemedText style={{color:'#fff'}}>{item.activo? 'Desactivar' : 'Activar'}</ThemedText>
            </Pressable>
            <Pressable style={[styles.btn, {backgroundColor:'#ef4444'}]} onPress={()=> handleDelete(item.id)}>
              <ThemedText style={{color:'#fff'}}>Eliminar</ThemedText>
            </Pressable>
          </>
        ) : (
          <ThemedText style={{color:'#6b7280'}}>Solo lectura</ThemedText>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title">Categorías</ThemedText>

      {isAdmin ? (
        <View style={styles.form}>
          <TextInput placeholder='Nombre' value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput placeholder='Descripción' value={descripcion} onChangeText={setDescripcion} style={styles.input} />
          <Pressable style={styles.createBtn} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={{color:'#fff'}}>{editingId ? 'Guardar cambios' : 'Crear categoría'}</ThemedText>}
          </Pressable>
          {editingId ? (
            <Pressable style={[styles.createBtn, {backgroundColor:'#9ca3af', marginTop:8}]} onPress={()=>{ setEditingId(undefined); setNombre(''); setDescripcion(''); }}>
              <ThemedText style={{color:'#fff'}}>Cancelar edición</ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={[styles.form, styles.readOnlyBanner]}>
          <ThemedText type="defaultSemiBold">Modo de consulta</ThemedText>
          <ThemedText>El auxiliar puede ver las categorías, pero no puede crear ni editar.</ThemedText>
        </View>
      )}

      {loading ? <ActivityIndicator /> : (
        <FlatList data={categorias} keyExtractor={(i)=>String(i.id)} renderItem={renderItem} ListEmptyComponent={<ThemedText>No hay categorías.</ThemedText>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:16},
  form:{marginVertical:12, gap:8},
  input:{borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, padding:8, backgroundColor:'#fff', marginBottom:8},
  createBtn:{backgroundColor:'#10b981', padding:12, borderRadius:8, alignItems:'center'},
  readOnlyBanner:{backgroundColor:'#f8fafc', borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, padding:12},
  row:{flexDirection:'row', padding:10, borderRadius:8, backgroundColor:'#fff', marginBottom:8, alignItems:'center'},
  actions:{flexDirection:'row', gap:8},
  btn:{padding:8, borderRadius:6, backgroundColor:'#e5e7eb', marginLeft:8}
});
