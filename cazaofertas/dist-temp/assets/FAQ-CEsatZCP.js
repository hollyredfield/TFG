import{j as e}from"./ui-BJ93jQot.js";import{a as s,L as u}from"./vendor-TA_wDYrC.js";import{Q as A,a3 as q,S as f,b1 as z,ac as T,aU as L,aV as V,d as M,ap as I,V as y}from"./index-BlDEwxQf.js";import"react-toastify";const $=()=>{const[p,d]=s.useState([]),[m,t]=s.useState([]),[n,h]=s.useState(""),[i,v]=s.useState("all"),[l,j]=s.useState({}),[N,g]=s.useState(!0),[Q,k]=s.useState(null),[x,w]=s.useState({}),P=[{id:"all",name:"Todas las preguntas"},{id:"pedidos",name:"Pedidos y envíos"},{id:"pagos",name:"Pagos y facturación"},{id:"productos",name:"Productos y ofertas"},{id:"cuenta",name:"Mi cuenta"},{id:"devoluciones",name:"Devoluciones"}],c=[{id:1,pregunta:"¿Cómo puedo realizar un seguimiento de mi pedido?",respuesta:'Puedes realizar un seguimiento de tu pedido accediendo a la sección "Mis Pedidos" en tu cuenta. Allí encontrarás todos tus pedidos y podrás hacer clic en cualquiera de ellos para ver su estado actual, detalles de envío y seguimiento. También recibirás notificaciones por correo electrónico cuando el estado de tu pedido cambie.',categoria:"pedidos",orden:1},{id:2,pregunta:"¿Cuáles son los métodos de pago aceptados?",respuesta:`Aceptamos diversas formas de pago para tu comodidad:

- Tarjetas de crédito/débito (Visa, Mastercard, American Express)
- PayPal
- Transferencia bancaria
- Pago contra reembolso (con cargo adicional)

Todos los pagos se procesan de forma segura mediante conexiones encriptadas.`,categoria:"pagos",orden:1},{id:3,pregunta:"¿Cómo puedo cambiar mi contraseña o datos personales?",respuesta:`Para cambiar tu contraseña o actualizar tus datos personales:

1. Inicia sesión en tu cuenta
2. Ve a la sección "Mi Perfil"
3. Para cambiar la contraseña, haz clic en "Cambiar contraseña"
4. Para actualizar datos personales, modifica los campos correspondientes y haz clic en "Guardar cambios"

Tus datos siempre se mantienen seguros y cifrados en nuestra base de datos.`,categoria:"cuenta",orden:1},{id:4,pregunta:"¿Cuál es la política de devoluciones?",respuesta:'Nuestra política de devoluciones contempla un plazo de 14 días naturales desde la recepción del producto para solicitar la devolución. El producto debe estar en perfectas condiciones, con el embalaje original y todos los accesorios. Para iniciar una devolución, accede a la sección "Mis Pedidos", selecciona el pedido correspondiente y haz clic en "Solicitar devolución". Una vez aprobada la devolución, te enviaremos instrucciones sobre cómo proceder con el envío.',categoria:"devoluciones",orden:1},{id:5,pregunta:"¿Cómo puedo guardar una oferta para más tarde?",respuesta:`Para guardar una oferta que te interese y verla más tarde:

1. Haz clic en el icono de "guardar" (símbolo de marcador) que aparece en cada oferta
2. La oferta se añadirá automáticamente a tu sección "Ofertas guardadas"
3. Puedes acceder a tus ofertas guardadas desde el menú de usuario

Además, puedes activar notificaciones para recibir alertas cuando las ofertas guardadas estén a punto de expirar.`,categoria:"productos",orden:1},{id:6,pregunta:"¿Los precios incluyen IVA?",respuesta:'Sí, todos los precios mostrados en nuestra plataforma incluyen IVA. El desglose del IVA aparecerá en tu factura, que podrás descargar desde la sección "Mis Pedidos".',categoria:"pagos",orden:2},{id:7,pregunta:"¿Cuánto tiempo tarda en llegar un pedido?",respuesta:`El tiempo de entrega varía según el tipo de envío seleccionado:

- Envío estándar: 3-5 días laborables
- Envío exprés: 1-2 días laborables
- Envío internacional: 7-14 días laborables

Estos plazos son estimados y pueden variar según la ubicación geográfica y la disponibilidad del producto. Puedes consultar el tiempo estimado de entrega durante el proceso de compra.`,categoria:"pedidos",orden:2},{id:8,pregunta:"¿Cómo puedo cancelar un pedido?",respuesta:`Para cancelar un pedido:

1. Accede a "Mis Pedidos" en tu cuenta
2. Selecciona el pedido que deseas cancelar
3. Haz clic en "Cancelar pedido"

Solo es posible cancelar pedidos que aún no hayan sido enviados. Si el pedido ya ha sido procesado para envío, tendrás que esperar a recibirlo y luego solicitar una devolución. Para cualquier duda, puedes contactar con nuestro servicio de soporte.`,categoria:"pedidos",orden:3},{id:9,pregunta:"¿Cómo puedo contactar con el servicio de atención al cliente?",respuesta:`Puedes contactar con nuestro servicio de atención al cliente de varias formas:

- Chat en línea: disponible en horario laboral en nuestra web
- Email: soporte@cazaofertas.com
- Teléfono: +34 911 23 45 67 (L-V 9:00-18:00)
- Formulario de contacto en la sección "Soporte"

Nuestro tiempo de respuesta habitual es de 24-48 horas en días laborables.`,categoria:"cuenta",orden:2},{id:10,pregunta:"¿Cómo puedo publicar una oferta?",respuesta:`Para publicar una oferta en nuestra plataforma:

1. Inicia sesión en tu cuenta
2. Haz clic en "Publicar oferta" en el menú principal
3. Rellena el formulario con los detalles de la oferta (título, descripción, precio, enlace, etc.)
4. Añade una imagen si es posible
5. Selecciona la categoría adecuada
6. Haz clic en "Publicar"

Tu oferta será revisada por nuestro equipo antes de ser publicada para garantizar su calidad y veracidad.`,categoria:"productos",orden:2},{id:11,pregunta:"¿Qué hago si recibo un producto defectuoso?",respuesta:`Si recibes un producto defectuoso:

1. Toma fotografías que muestren claramente el defecto
2. Accede a "Mis Pedidos" y selecciona el pedido correspondiente
3. Haz clic en "Reportar problema" e indica que has recibido un producto defectuoso
4. Adjunta las fotografías como evidencia
5. Nuestro equipo revisará tu caso y te contactará con instrucciones sobre cómo proceder

Generalmente ofrecemos reembolso completo o reemplazo del producto en estos casos.`,categoria:"devoluciones",orden:2},{id:12,pregunta:"¿Cómo funcionan las notificaciones de ofertas?",respuesta:`Las notificaciones de ofertas te permiten estar al día de las mejores promociones según tus preferencias. Puedes configurarlas así:

1. Ve a "Mi Perfil" > "Preferencias de notificaciones"
2. Selecciona las categorías que te interesan
3. Elige la frecuencia de notificaciones (diaria, semanal, inmediata)
4. Activa notificaciones push, email o ambas

También puedes recibir alertas de precio para productos específicos que estés siguiendo cuando alcancen el precio deseado.`,categoria:"productos",orden:3}];s.useEffect(()=>{async function a(){g(!0);try{const{data:r,success:o,error:H}=await I();o&&r&&r.length>0?(d(r),t(r)):(console.log("Usando datos demo para FAQs"),d(c),t(c))}catch(r){console.error("Error cargando FAQs:",r),k("No se pudieron cargar las preguntas frecuentes"),d(c),t(c),y.error("Error al cargar preguntas frecuentes")}finally{g(!1)}}a()},[]),s.useEffect(()=>{C()},[n,i,p]);const C=()=>{let a=p;if(i!=="all"&&(a=a.filter(r=>r.categoria===i)),n.trim()){const r=n.toLowerCase();a=a.filter(o=>o.pregunta.toLowerCase().includes(r)||o.respuesta.toLowerCase().includes(r))}a=[...a].sort((r,o)=>(r.orden||0)-(o.orden||0)),t(a)},F=a=>{j(r=>({...r,[a]:!r[a]}))},S=a=>{h(a.target.value)},E=a=>{v(a)},b=(a,r)=>{w(o=>({...o,[a]:r})),y.success(r?"¡Gracias por tu feedback positivo!":"Agradecemos tu feedback. Trabajaremos para mejorar esta respuesta.")};return e.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-8",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Preguntas Frecuentes"}),e.jsx("p",{className:"text-gray-500 dark:text-gray-400 mt-2",children:"Encuentra respuestas rápidas a las preguntas más comunes"})]}),e.jsx("div",{className:"mt-4 sm:mt-0",children:e.jsxs(u,{to:"/soporte",className:"button-modern button-primary inline-flex items-center",children:[e.jsx(A,{className:"mr-2"}),"Contactar soporte"]})})]}),e.jsx("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4 mb-8",children:e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",placeholder:"Busca tu pregunta aquí...",value:n,onChange:S,className:"w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"}),e.jsx(q,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"})]})}),e.jsx("div",{className:"flex flex-wrap gap-2 mb-8",children:P.map(a=>e.jsx("button",{onClick:()=>E(a.id),className:`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i===a.id?"bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:a.name},a.id))}),N?e.jsx("div",{className:"flex justify-center items-center py-20",children:e.jsx("div",{className:"animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent"})}):m.length===0?e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-soft p-10 text-center",children:[e.jsx(f,{className:"mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4"}),e.jsx("h3",{className:"text-xl font-medium text-gray-900 dark:text-white mb-2",children:"No se encontraron resultados"}),e.jsx("p",{className:"text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto",children:"No encontramos preguntas que coincidan con tu búsqueda. Intenta con otros términos o contacta con nuestro soporte."}),e.jsx(u,{to:"/soporte",className:"button-modern button-primary",children:"Contactar con soporte"})]}):e.jsx("div",{className:"space-y-4",children:m.map(a=>e.jsxs("div",{className:`bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden transition-all ${l[a.id]?"ring-2 ring-primary/30":""}`,children:[e.jsxs("button",{onClick:()=>F(a.id),className:"flex justify-between items-center w-full p-5 text-left",children:[e.jsx("h3",{className:"font-medium text-gray-900 dark:text-white text-lg",children:a.pregunta}),l[a.id]?e.jsx(z,{className:"flex-shrink-0 text-primary"}):e.jsx(T,{className:"flex-shrink-0 text-gray-400 dark:text-gray-500"})]}),l[a.id]&&e.jsxs("div",{className:"p-5 pt-0 border-t border-gray-200 dark:border-gray-700",children:[e.jsx("p",{className:"text-gray-700 dark:text-gray-300 whitespace-pre-line",children:a.respuesta}),e.jsx("div",{className:"mt-6 pt-4 border-t border-gray-100 dark:border-gray-700",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center",children:[e.jsx("div",{children:e.jsx("p",{className:"text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0",children:"¿Te ha resultado útil esta respuesta?"})}),x[a.id]!==void 0?e.jsx("span",{className:`text-sm ${x[a.id]?"text-green-500 dark:text-green-400":"text-gray-500 dark:text-gray-400"}`,children:"Gracias por tu feedback"}):e.jsxs("div",{className:"flex space-x-2",children:[e.jsxs("button",{onClick:r=>{r.stopPropagation(),b(a.id,!0)},className:"flex items-center space-x-1 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",children:[e.jsx(L,{className:"text-gray-500 dark:text-gray-400"}),e.jsx("span",{children:"Sí"})]}),e.jsxs("button",{onClick:r=>{r.stopPropagation(),b(a.id,!1)},className:"flex items-center space-x-1 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",children:[e.jsx(V,{className:"text-gray-500 dark:text-gray-400"}),e.jsx("span",{children:"No"})]})]})]})})]})]},a.id))}),e.jsxs("div",{className:"mt-12 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-xl p-8 relative overflow-hidden",children:[e.jsxs("div",{className:"max-w-lg",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-4",children:"¿No encuentras la respuesta que buscas?"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-6",children:"Nuestro equipo de soporte está listo para ayudarte con cualquier duda o problema que tengas."}),e.jsxs(u,{to:"/soporte",className:"button-modern button-primary inline-flex items-center",children:["Contactar con soporte",e.jsx(M,{className:"ml-2"})]})]}),e.jsx("div",{className:"absolute -bottom-10 -right-10 opacity-10",children:e.jsx(f,{className:"text-9xl text-primary"})})]})]})};export{$ as default};
