// Update the fetchOffers function to fix column name
const fetchOffers = async () => {
  try {
    console.log('[OffersList] 🟡 Iniciando fetch de ofertas', { slug, filters });
    
    let query = supabase.from('ofertas').select('*');
    
    // Apply filters if any
    if (slug) {
      query = query.eq('id_categoria', (await supabase.from('categorias').select('id').eq('slug', slug).single()).data.id);
    }
    
    // Fix column name from 'created_at' to 'creado_en'
    query = query.order('creado_en', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    setOffers(data);
    setLoading(false);
    console.log('[OffersList] 🏁 Carga completada');
  } catch (error) {
    console.log('[OffersList] 🔴 Error:', error);
    setError(error);
    setLoading(false);
  }
};
