import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold text-red-600">Acceso denegado</h1>
      <p className="text-gray-500">No tienes permiso para ver esta página.</p>
      <Link to="/" className="text-blue-500 underline">
        Volver al inicio
      </Link>
    </main>
  );
};

export default UnauthorizedPage;
