'use client';

import { useState } from 'react';
import { RegistrationFormData, ValidationErrors } from '@/types';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function RegistrationForm({ onSubmit, isLoading = false }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (field: keyof RegistrationFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo se permiten letras y espacios';
        return undefined;
      
      case 'phone':
        if (value.length < 10) return 'El teléfono debe tener al menos 10 caracteres';
        if (!/^[\d\s\-\+\(\)]+$/.test(value)) return 'Formato de teléfono no válido';
        return undefined;
      
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email no válido';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real solo si el campo ya fue tocado
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      const field = key as keyof RegistrationFormData;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true });

    // Si no hay errores, enviar
    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
      }
    }
  };

  const isFormValid = Object.values(errors).every(error => !error) && 
                     Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        ¡Bienvenido a Flappy Plane!
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            disabled={isLoading}
            className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black ${
              errors.name && touched.name 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-white'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="Ingresa tu nombre"
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Campo Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            disabled={isLoading}
            className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black ${
              errors.phone && touched.phone 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-white'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="+1 234 567 8900"
          />
          {errors.phone && touched.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={isLoading}
            className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black ${
              errors.email && touched.email 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-white'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="tu@email.com"
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all ${
            isFormValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } disabled:transform-none disabled:shadow-none`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Cargando...
            </div>
          ) : (
            '🚀 Comenzar Juego'
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Al registrarte aceptas que guardemos tu información para el juego
      </p>
    </div>
  );
}