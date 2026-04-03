import { useState } from "react";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      console.log("🔓 Login simulado:", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      console.log("✨ Cadastro simulado:", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }

    // Limpar formulário
    setFormData({ name: "", email: "", password: "" });

    // Redirecionar para check-in
    onAuthSuccess();
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">FitPatch</h1>
        <p className="text-gray-400">
          {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome - Apenas para Cadastro */}
        {!isLogin && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu.email@example.com"
            className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Senha */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-500 focus:border-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Botão Principal */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors mt-6"
        >
          {isLogin ? "Entrar" : "Cadastrar"}
        </button>
      </form>

      {/* Alternância de Telas */}
      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-red-600 hover:text-red-500 font-semibold transition-colors"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}
