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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 selection:bg-blue-500/30">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 gap-8 lg:gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-lg w-full">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start gap-3 transform hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">CV Builder</h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">Pro</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 leading-tight">
              {isEs ? 'Tu carrera,' : 'Your career,'}<br/>{isEs ? 'tu historia.' : 'your story.'}
            </h2>
            <p className="text-slate-300 text-lg lg:text-xl leading-relaxed">
              {isEs
                ? 'Diseña currículums que abran puertas. Plantillas modernas, personalización total y exportación instantánea.'
                : 'Design resumes that open doors. Modern templates, full customization, and instant export.'}
            </p>
          </div>

          {/* Feature pills */}
          <div className="hidden sm:flex flex-wrap gap-3 justify-center lg:justify-start">
            {[ui.feature1, ui.feature2, ui.feature3, ui.feature4].map((f, i) => (
              <div key={f} className="flex items-center gap-2 glass-panel rounded-full px-4 py-2 hover:bg-white/10 transition-colors duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-200 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Auth Form */}
        <div className="w-full max-w-md">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Inner top glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-50"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{ui.welcome}</h2>
              <p className="text-slate-400 text-sm">{ui.subtitle}</p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-900/50 p-1 mb-8 border border-slate-700/50">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  tab === 'login' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {ui.login}
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  tab === 'register' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {ui.register}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {tab === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                    {ui.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEs ? 'Tu nombre completo' : 'Your full name'}
                    required
                    className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                  {ui.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                  {ui.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEs ? 'Mínimo 6 caracteres' : 'At least 6 characters'}
                  required
                  minLength={6}
                  className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 shadow-lg shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {ui.loading}
                      </>
                    ) : (
                      tab === 'login' ? ui.submit_login : ui.submit_register
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Switch tab link */}
            <p className="mt-8 text-center text-sm text-slate-400">
              <button
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline underline-offset-4"
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
