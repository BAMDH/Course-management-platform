import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as { statusText?: string; message?: string } | null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">¡Oops!</h1>
      <p className="text-gray-500">
        {error?.statusText ?? error?.message ?? 'Página no encontrada'}
      </p>
      <Link to="/" className="text-blue-500 underline">
        Volver al inicio
      </Link>
    </main>
  );
};

export default ErrorPage;
