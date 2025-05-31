// ProductDetail.jsx - Versión temporal sin las funciones duplicadas
// Instrucciones: Reemplazar en ProductDetail.jsx eliminando las funciones duplicadas:

/* 
En el archivo ProductDetail.jsx, buscar estas líneas alrededor de 363-380:

  // Handle toggling price alert
  const handleTogglePriceAlert = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para recibir alertas de precio');
      return;
    }
    
    try {
      if (priceAlertEnabled) {
        // Logic to disable price alert
        setPriceAlertEnabled(false);
        toast.success('Alerta de bajada de precio desactivada');
      } else {
        // Logic to enable price alert
        setPriceAlertEnabled(true);
        
        await NotificationService.notifyPriceDropOnWishlist(
          user.id, 
          product,
          product.precio_actual,
          product.precio_actual // Same price now, will be updated when price drops
        );
        
        toast.success('Recibirás notificaciones cuando este producto baje de precio');
      }
    } catch (error) {
      console.error('Error al gestionar la alerta de precio:', error);
      toast.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    }
  };

Y REEMPLAZARLO con:

  // La función handleTogglePriceAlert ya está definida arriba
  

También buscar estas líneas alrededor de 395-415:

  // Handle toggling stock alert
  const handleToggleStockAlert = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para recibir alertas de stock');
      return;
    }
    
    try {
      if (stockAlertEnabled) {
        // Logic to disable stock alert
        setStockAlertEnabled(false);
        toast.success('Alerta de disponibilidad desactivada');
      } else {
        // Logic to enable stock alert
        setStockAlertEnabled(true);
        
        // Create notification for when product is back in stock
        await NotificationService.createNotification({
          userId: user.id,
          type: 'STOCK',
          title: 'Alerta de stock activada',
          message: `Te notificaremos cuando ${product.nombre} esté disponible.`,
          data: {
            product_id: product.id,
            product_name: product.nombre
          }
        });
        
        toast.success('Recibirás una notificación cuando el producto esté disponible');
      }
    } catch (error) {
      console.error('Error al gestionar la alerta de stock:', error);
      toast.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    }
  };

Y REEMPLAZARLO con:

  // La función handleToggleStockAlert ya está definida arriba
  
*/
