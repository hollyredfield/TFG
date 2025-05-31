import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import forumService from '../services/forumService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';

const CreateThread = () => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redireccionar si no está autenticado
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/foro/nuevo' } });
    }    const fetchCategorias = async () => {
      try {
        const { data, error } = await forumService.getCategories();

        if (error) throw error;
        setCategorias(data || []);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías. Por favor, inténtalo de nuevo.');
      }
    };

    fetchCategorias();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      toast.error('El título no puede estar vacío');
      return;
    }
    
    if (!contenido.trim()) {
      toast.error('El contenido no puede estar vacío');
      return;
    }
    
    if (!categoriaId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }
    
    setLoading(true);
    setError(null);
      try {
      // Crear el tema usando el servicio simulado
      const { data, error } = await forumService.createThread({
        titulo,
        contenido,
        categoria_id: categoriaId,
        user_id: user.id
      });
      
      if (error) throw error;
      
      toast.success('Tema creado correctamente');
      navigate(`/foro/tema/${data[0].id}`);
    } catch (err) {
      console.error('Error al crear tema:', err);
      setError('No se pudo crear el tema. Por favor, inténtalo de nuevo.');
      toast.error('Error al crear el tema');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/foro')}
          className="flex items-center text-primary hover:underline"
        >
          <FaArrowLeft className="mr-1" /> Volver al foro
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear nuevo tema</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="titulo" className="block text-gray-700 font-medium mb-2">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Escribe un título descriptivo para tu tema"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="categoria" className="block text-gray-700 font-medium mb-2">
              Categoría
            </label>
            <select
              id="categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Seleccionar categoría</option>              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="contenido" className="block text-gray-700 font-medium mb-2">
              Contenido
            </label>
            <ReactQuill 
              theme="snow"
              modules={modules}
              value={contenido}
              onChange={setContenido}
              className="bg-white"
              placeholder="Describe tu tema con detalle..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/foro')}
              className="px-4 py-2 text-gray-600 mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear tema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThread;
