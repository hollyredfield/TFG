// Script para verificar slugs en formato CommonJS
const fs = require('fs');

// Leer el archivo directamente
const fileContent = fs.readFileSync('./src/data/mockData.js', 'utf8');

// Extraer la parte del array de ofertas mediante una expresión regular
const ofertasMatch = fileContent.match(/const ofertas = \[([\s\S]*?)\];/);

if (!ofertasMatch) {
  console.log('No se pudo encontrar el array de ofertas en el archivo');
  process.exit(1);
}

// Evaluamos el contenido del array en un contexto seguro
let ofertas = [];
try {
  // Crear una función que evalúe el array como JavaScript
  const createArray = new Function(`return [${ofertasMatch[1]}];`);
  ofertas = createArray();
} catch (error) {
  console.error('Error al parsear las ofertas:', error);
  process.exit(1);
}

console.log('Total ofertas:', ofertas.length);

// Verificar ofertas sin slug
const sinSlug = ofertas.filter(o => !o.slug);
console.log('Ofertas sin slug:', sinSlug.length);

if (sinSlug.length > 0) {
  console.log('Ejemplos de ofertas sin slug:');
  sinSlug.slice(0, 3).forEach(o => {
    console.log({id: o.id, titulo: o.titulo});
  });
}

// Verificar slugs duplicados
const slugs = ofertas.map(o => o.slug).filter(Boolean);
const uniqueSlugs = [...new Set(slugs)];
console.log('Slugs únicos:', uniqueSlugs.length, 'de', slugs.length);

if (slugs.length !== uniqueSlugs.length) {
  console.log('¡Hay slugs duplicados!');
  const counts = {};
  slugs.forEach(slug => {
    counts[slug] = (counts[slug] || 0) + 1;
  });
  
  for (const slug in counts) {
    if (counts[slug] > 1) {
      console.log(`El slug "${slug}" aparece ${counts[slug]} veces`);
      
      // Mostrar las ofertas con este slug duplicado
      const ofertasDuplicadas = ofertas.filter(o => o.slug === slug);
      ofertasDuplicadas.forEach(o => {
        console.log({id: o.id, titulo: o.titulo});
      });
    }
  }
}
