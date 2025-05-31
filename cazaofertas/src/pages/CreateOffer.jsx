import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUpload, FaLink, FaTag, FaStore, FaBoxOpen, FaPencilAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import mockData from '../data/mockData';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import { createOffer, uploadImage } from '../services/supabase';
import { FaImage, FaSpinner, FaBell } from 'react-icons/fa';
import NotificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const CreateOffer = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createNotification } = useNotifications();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar datos
      if (!title || !url || !currentPrice || !categoryId) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      let imageUrl = '';
      if (image) {
        const { data: imageData, error: imageError } = await uploadImage(
          image,
          `offers/${Date.now()}_${image.name}`
        );
        if (imageError) throw imageError;
        imageUrl = imageData.path;
      }

      const offerData = {
        title,
        description,
        url,
        current_price: parseFloat(currentPrice),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        category_id: parseInt(categoryId),
        image_url: imageUrl || '',
        user_id: user.id,
        notify_followers: notifyFollowers
      };

      const { data: newOffer, error: offerError } = await createOffer(offerData);
      if (offerError) throw offerError;
      
      // Create notification for the user who published the offer
      await NotificationService.notifyOfferCreated(user.id, { 
        id: newOffer.id, 
        title: title 
      });
      
      // If notify followers is enabled, we would notify followers here
      // This would typically be handled by a server-side function
      if (notifyFollowers && newOffer) {
        // In a real app, this would be triggered from the backend
        // Here we'll just create a notification for the current user to demonstrate
        
        // Get category name for the notification
        const categoryName = mockData.categorias.find(cat => cat.id === parseInt(categoryId))?.nombre || 'General';
        
        // Create a test notification to show the feature
        await createNotification({
          userId: user.id,
          type: 'OFFER',
          title: 'Nueva oferta publicada',
          message: `Tu oferta "${title}" ha sido publicada en la categoría ${categoryName}.`,
          data: {
            offer_id: newOffer.id,
            category_id: parseInt(categoryId),
            category_name: categoryName
          }
        });
      }

      toast.success('¡Oferta publicada con éxito!');
      navigate('/ofertas/recientes');
    } catch (error) {
      console.error('Error al publicar oferta:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Publicar nueva oferta
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título de la oferta *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ej: MacBook Pro M2 con 256GB"
                  required
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de la oferta *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLink className="text-gray-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio actual *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">€</span>
                  </div>
                  <input
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    className="bg-gray-700 block w-full pl-8 pr-3 py-2 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio original
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">€</span>
                  </div>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="bg-gray-700 block w-full pl-8 pr-3 py-2 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría *
              </label>
              <select
                className="block w-full px-4 py-3 mt-1 text-base border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Selecciona una categoría</option>
                {mockData.categorias.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="bg-gray-700 block w-full px-3 py-2 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Describe los detalles de la oferta..."
              />
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen de la oferta
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setPreview('');
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Subir imagen</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF hasta 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Notificación */}
            <div className="flex items-center">
              <input
                id="notify-followers"
                name="notify-followers"
                type="checkbox"
                checked={notifyFollowers}
                onChange={(e) => setNotifyFollowers(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded bg-gray-700"
              />
              <label htmlFor="notify-followers" className="ml-2 flex items-center text-sm text-gray-300">
                <FaBell className="text-indigo-400 mr-2" />
                Notificar a seguidores sobre esta oferta
              </label>
            </div>

            {/* Botón submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <FaUpload className="-ml-1 mr-2 h-5 w-5" />
                    Publicar oferta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;
