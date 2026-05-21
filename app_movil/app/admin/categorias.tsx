import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import apiClient from '../../src/api/apiClient';

type Categoria = { id?: number; nombre?: string; descripcion?: string; activo?: boolean };

export default function AdminCategoriasScreen(){
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
    if(!id) return;
    try{
      await apiClient.patch(`/admin/categorias/${id}/toggle`);
      fetchCategorias();
    }catch(err){ Alert.alert('Error', (err as Error).message || 'No se pudo cambiar estado'); }
  };

  const handleDelete = (id?: number)=>{
    if(!id) return;
    Alert.alert('Eliminar','¿Seguro que desea eliminar esta categoría?',[
      {text:'Cancelar', style:'cancel'},
      {text:'Eliminar', style:'destructive', onPress: async ()=>{
        try{ await apiClient.delete(`/admin/categorias/${id}`); fetchCategorias(); }
        catch(err){ Alert.alert('Error', (err as Error).message || 'No se pudo eliminar'); }
      }}
    ]);
  };

  const renderItem = ({item}:{item:Categoria}) => (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <ThemedText type="defaultSemiBold">{item.nombre}</ThemedText>
        <ThemedText>{item.descripcion}</ThemedText>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={()=> { setNombre(item.nombre || ''); setDescripcion(item.descripcion || ''); setEditingId(item.id); }}>
          <ThemedText>Editar</ThemedText>
        </Pressable>
        <Pressable style={[styles.btn, {backgroundColor: item.activo? '#f97373': '#34d399'}]} onPress={()=> handleToggle(item.id)}>
          <ThemedText style={{color:'#fff'}}>{item.activo? 'Desactivar' : 'Activar'}</ThemedText>
        </Pressable>
        <Pressable style={[styles.btn, {backgroundColor:'#ef4444'}]} onPress={()=> handleDelete(item.id)}>
          <ThemedText style={{color:'#fff'}}>Eliminar</ThemedText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title">Categorías</ThemedText>

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
  row:{flexDirection:'row', padding:10, borderRadius:8, backgroundColor:'#fff', marginBottom:8, alignItems:'center'},
  actions:{flexDirection:'row', gap:8},
  btn:{padding:8, borderRadius:6, backgroundColor:'#e5e7eb', marginLeft:8}
});
