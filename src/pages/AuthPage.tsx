import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'login' | 'register';

interface AuthPageProps {
  language: 'es' | 'en';
}

export const AuthPage: React.FC<AuthPageProps> = ({ language }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEs = language === 'es';

  const ui = {
    welcome: isEs ? 'Bienvenido a CV Builder' : 'Welcome to CV Builder',
    subtitle: isEs
      ? 'Crea currículums profesionales en minutos'
      : 'Create professional resumes in minutes',
    login: isEs ? 'Iniciar Sesión' : 'Login',
    register: isEs ? 'Registrarse' : 'Register',
    name: isEs ? 'Nombre completo' : 'Full name',
    email: 'Email',
    password: isEs ? 'Contraseña' : 'Password',
    submit_login: isEs ? 'Iniciar Sesión' : 'Sign In',
    submit_register: isEs ? 'Crear Cuenta' : 'Create Account',
    loading: isEs ? 'Cargando...' : 'Loading...',
    switch_to_register: isEs ? '¿No tienes cuenta? Regístrate' : "Don't have an account? Register",
    switch_to_login: isEs ? '¿Ya tienes cuenta? Inicia sesión' : 'Already have an account? Sign in',
    feature1: isEs ? '7 plantillas profesionales' : '7 professional templates',
    feature2: isEs ? 'Bilingüe ES/EN' : 'Bilingual ES/EN',
    feature3: isEs ? 'Exporta a PDF' : 'Export to PDF',
    feature4: isEs ? 'Guarda en la nube' : 'Save to cloud',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: { msg: string }[] } } };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.[0]?.msg ||
        (isEs ? 'Ocurrió un error. Intenta de nuevo.' : 'An error occurred. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left panel — dark gradient */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">CV Builder</span>
          <span className="text-xs bg-blue-500 bg-opacity-60 text-blue-100 px-2 py-0.5 rounded-full font-semibold">Pro</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            {isEs ? 'Tu carrera, tu historia.' : 'Your career, your story.'}
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            {isEs
              ? 'Diseña currículums que abran puertas. Plantillas modernas, personalización total y exportación instantánea.'
              : 'Design resumes that open doors. Modern templates, full customization, and instant export.'}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[ui.feature1, ui.feature2, ui.feature3, ui.feature4].map((f) => (
              <div key={f} className="flex items-center gap-2 bg-white bg-opacity-10 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-blue-400 text-sm">
          &copy; {new Date().getFullYear()} CV Builder
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-gray-900 text-lg font-bold">CV Builder</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{ui.welcome}</h2>
            <p className="text-gray-500 text-sm mb-6">{ui.subtitle}</p>

            {/* Tabs */}
            <div className="flex rounded-xl border border-gray-200 p-1 mb-6 bg-gray-50">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {ui.login}
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {ui.register}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    {ui.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEs ? 'Tu nombre completo' : 'Your full name'}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {ui.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {ui.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEs ? 'Mínimo 6 caracteres' : 'At least 6 characters'}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? ui.loading : tab === 'login' ? ui.submit_login : ui.submit_register}
              </button>
            </form>

            {/* Switch tab link */}
            <p className="mt-5 text-center text-sm text-gray-500">
              <button
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {tab === 'login' ? ui.switch_to_register : ui.switch_to_login}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
