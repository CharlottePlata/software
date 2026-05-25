import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Pressable, Alert, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import apiClient from '../../src/api/apiClient';
import { useAuth } from '../../src/context/AuthContext';

type Subcategoria = { id?: number; nombre?: string; descripcion?: string; categoriaId?: number; activo?: boolean };
type Categoria = { id?: number; nombre?: string };

export default function AdminSubcategoriasScreen(){
  const { user } = useAuth() as { user: { rol?: string } | null };
  const isAdmin = user?.rol === 'administrador';
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState<number|undefined>(undefined);
  // router not required for inline edit

  const fetchAll = async ()=>{
    setLoading(true);
    try{
      const [subsRes, catsRes] = await Promise.all([
        apiClient.get('/admin/subcategorias'),
        apiClient.get('/admin/categorias')
      ]);
      const subs = subsRes.data?.data?.subcategorias || [];
      const cats = catsRes.data?.data?.categorias || [];
      setSubcategorias(Array.isArray(subs)? subs: []);
      setCategorias(Array.isArray(cats)? cats: []);
    }catch(err){
      Alert.alert('Error', (err as Error).message || 'No se pudo cargar');
    }finally{setLoading(false)}
  };

  useEffect(()=>{ fetchAll(); },[]);

  const [editingId, setEditingId] = useState<number|undefined>(undefined);

  const handleSave = async ()=>{
    if (!isAdmin) return Alert.alert('Acceso restringido', 'Solo el administrador puede crear o editar subcategorías');
    if(!nombre.trim() || !categoriaId) return Alert.alert('Validación','Nombre y categoría son obligatorios');
    setSaving(true);
    try{
      if (editingId) {
        await apiClient.put(`/admin/subcategorias/${editingId}`, { nombre: nombre.trim(), descripcion, categoriaId });
      } else {
        await apiClient.post('/admin/subcategorias', { nombre: nombre.trim(), descripcion, categoriaId });
      }
      setNombre(''); setDescripcion(''); setCategoriaId(undefined); setEditingId(undefined);
      fetchAll();
    }catch(err){ Alert.alert('Error', (err as Error).message || 'No se pudo guardar'); }
    finally{ setSaving(false); }
  };

  const handleToggle = async (id?: number)=>{ if(!isAdmin) return Alert.alert('Acceso restringido', 'Solo el administrador puede activar o desactivar subcategorías'); if(!id) return; try{ await apiClient.patch(`/admin/subcategorias/${id}/toggle`); fetchAll(); }catch(err){ Alert.alert('Error', (err as Error).message || 'No se pudo cambiar estado'); }};

  const handleDelete = (id?: number)=>{ if(!id) return; Alert.alert('Acceso restringido', 'No tiene permitido eliminar'); };

  const renderItem = ({item}:{item:Subcategoria}) => (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <ThemedText type="defaultSemiBold">{item.nombre}</ThemedText>
        <ThemedText>{item.descripcion}</ThemedText>
        <ThemedText style={{color:'#6b7280'}}>Categoria: {categorias.find(c=>c.id===item.categoriaId)?.nombre || 'N/D'}</ThemedText>
      </View>
      <View style={styles.actions}>
        {isAdmin ? (
          <>
            <Pressable style={styles.btn} onPress={()=> { setNombre(item.nombre || ''); setDescripcion(item.descripcion || ''); setCategoriaId(item.categoriaId); setEditingId(item.id); }}>
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
      <ThemedText type="title">Subcategorías</ThemedText>

      {isAdmin ? (
        <View style={styles.form}>
          <TextInput placeholder='Nombre' value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput placeholder='Descripción' value={descripcion} onChangeText={setDescripcion} style={styles.input} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:8}}>
            {categorias.map(cat=> (
              <Pressable key={cat.id} onPress={()=> setCategoriaId(cat.id)} style={[styles.chip, categoriaId===cat.id && styles.chipActive]}>
                <ThemedText style={categoriaId===cat.id? {color:'#fff'}: {}}>{cat.nombre}</ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable style={styles.createBtn} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <ThemedText style={{color:'#fff'}}>{editingId ? 'Guardar cambios' : 'Crear subcategoría'}</ThemedText>}
          </Pressable>
          {editingId ? (
            <Pressable style={[styles.createBtn, {backgroundColor:'#9ca3af', marginTop:8}]} onPress={()=>{ setEditingId(undefined); setNombre(''); setDescripcion(''); setCategoriaId(undefined); }}>
              <ThemedText style={{color:'#fff'}}>Cancelar edición</ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={[styles.form, styles.readOnlyBanner]}>
          <ThemedText type="defaultSemiBold">Modo de consulta</ThemedText>
          <ThemedText>El auxiliar puede ver las subcategorías, pero no puede crear ni editar.</ThemedText>
        </View>
      )}

      {loading ? <ActivityIndicator /> : (
        <FlatList data={subcategorias} keyExtractor={(i)=>String(i.id)} renderItem={renderItem} ListEmptyComponent={<ThemedText>No hay subcategorías.</ThemedText>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:16},
  form:{marginVertical:12, gap:8},
  input:{borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, padding:8, backgroundColor:'#fff', marginBottom:8},
  createBtn:{backgroundColor:'#06b6d4', padding:12, borderRadius:8, alignItems:'center'},
  readOnlyBanner:{backgroundColor:'#f8fafc', borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, padding:12},
  row:{flexDirection:'row', padding:10, borderRadius:8, backgroundColor:'#fff', marginBottom:8, alignItems:'center'},
  actions:{flexDirection:'row', gap:8},
  btn:{padding:8, borderRadius:6, backgroundColor:'#e5e7eb', marginLeft:8},
  chip:{paddingHorizontal:12, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:'#e5e7eb', marginRight:8, backgroundColor:'#fff'},
  chipActive:{backgroundColor:'#06b6d4'}
});
