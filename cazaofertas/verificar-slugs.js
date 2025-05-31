// Script para verificar slugs
import { ofertas as allOffers } from './src/data/mockData.js';
import mockDataDefault from './src/data/mockData.js'; // To see what default export contains

console.log('--- Script de Verificación de Slugs: Inicio ---');
console.log('Intentando cargar el export nombrado "ofertas"...');

if (allOffers && Array.isArray(allOffers)) {
  console.log('Éxito: Export nombrado "ofertas" cargado correctamente.');
  console.log('Total de ofertas encontradas:', allOffers.length);

  const ofertasSinSlug = allOffers.filter(o => !o.slug || o.slug.trim() === '');
  console.log('Número de ofertas sin slug (o con slug vacío):', ofertasSinSlug.length);

  if (ofertasSinSlug.length > 0) {
    console.log('Ejemplos de ofertas sin slug (o con slug vacío):');
    ofertasSinSlug.slice(0, 5).forEach(o => { // Mostrar hasta 5 ejemplos
      console.log({ id: o.id, titulo: o.titulo, slug: o.slug });
    });
  }

  // Verificar duplicados en slugs existentes
  const slugsExistentes = allOffers.map(o => o.slug).filter(slug => slug && slug.trim() !== '');
  const conteoSlugs = {};
  slugsExistentes.forEach(slug => {
    conteoSlugs[slug] = (conteoSlugs[slug] || 0) + 1;
  });

  const slugsDuplicados = Object.entries(conteoSlugs).filter(([slug, count]) => count > 1);

  if (slugsDuplicados.length > 0) {
    console.log('¡Alerta! Se encontraron slugs duplicados:');
    slugsDuplicados.forEach(([slug, count]) => {
      console.log(`El slug "${slug}" aparece ${count} veces.`);
      // Mostrar las ofertas con este slug duplicado
      const ofertasConEsteSlug = allOffers.filter(o => o.slug === slug);
      console.log(`Ofertas con el slug "${slug}":`);
      ofertasConEsteSlug.forEach(o => {
        console.log({ id: o.id, titulo: o.titulo });
      });
    });
  } else {
    console.log('No se encontraron slugs duplicados entre las ofertas que tienen slug.');
  }

} else {
  console.error('Error: No se pudo cargar el export nombrado "ofertas" o no es un array.');
  console.log('Contenido de "allOffers":', allOffers);
  
  // Intentar inspeccionar el export por defecto si el nombrado falla
  if (mockDataDefault && mockDataDefault.ofertas && Array.isArray(mockDataDefault.ofertas)) {
    console.log('Información adicional: Se encontró un array "ofertas" en el export por defecto.');
    console.log('Total de ofertas en el export por defecto:', mockDataDefault.ofertas.length);
  } else {
    console.log('Información adicional: No se encontró un array "ofertas" utilizable en el export por defecto.');
    console.log('Contenido del export por defecto (mockDataDefault):', mockDataDefault);
  }
}

console.log('--- Script de Verificación de Slugs: Fin ---');
