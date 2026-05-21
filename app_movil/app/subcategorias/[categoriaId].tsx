import React, {useEffect, useState} from 'react';
import { View, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { useLocalSearchParams, router } from 'expo-router';
import apiClient from '../../src/api/apiClient';

type Subcategoria = { id?: number; nombre?: string; descripcion?: string; activo?: boolean };

export default function SubcategoriasScreen(){
  const { categoriaId } = useLocalSearchParams<{categoriaId: string}>();
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubcategorias = async ()=>{
    if(!categoriaId) return;
    setLoading(true);
    try{
      const res = await apiClient.get(`/catalogo/categorias/${categoriaId}/subcategorias`);
      const subs = res.data?.data?.subcategorias || [];
      setSubcategorias(Array.isArray(subs)? subs: []);
    }catch(err){
      // silenciar: mostrar vacío
      setSubcategorias([]);
    }finally{ setLoading(false); }
  };

  useEffect(()=>{ fetchSubcategorias(); },[categoriaId]);

  const renderItem = ({item}:{item:Subcategoria}) => (
    <Pressable style={styles.row} onPress={()=>{/* futuro: navegar a productos filtrados */}}>
      <View style={{flex:1}}>
        <ThemedText type="defaultSemiBold">{item.nombre}</ThemedText>
        <ThemedText style={{color:'#6b7280'}}>{item.descripcion}</ThemedText>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title">Subcategorías</ThemedText>

      {loading ? <ActivityIndicator /> : (
        <FlatList data={subcategorias} keyExtractor={(i)=>String(i.id)} renderItem={renderItem} ListEmptyComponent={<ThemedText>No hay subcategorías.</ThemedText>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:16},
  row:{flexDirection:'row', padding:12, borderRadius:8, backgroundColor:'#fff', marginBottom:8, alignItems:'center'}
});
