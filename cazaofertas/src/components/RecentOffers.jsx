// Update the fetchData function to remove .execute() and fix column name
const fetchData = async () => {
  try {
    console.log('[RecentOffers] 🔄 Iniciando carga de datos...');
    
    // Remove the .execute() call which doesn't exist in the Supabase client
    const { data, error } = await supabase
      .from('ofertas')
      .select('*')
      .order('creado_en', { ascending: false })
      .limit(6);
      
    if (error) throw error;
    
    setOffers(data);
    setLoading(false);
  } catch (error) {
    console.log('[RecentOffers] ❌ Error:', error);
    setError(error);
    setLoading(false);
  }
};
