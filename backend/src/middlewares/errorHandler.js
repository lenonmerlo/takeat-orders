export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";

  const response = {
    error: code,
    message: status === 500 ? "Erro interno" : err.message,
  };

  if (err.details) response.details = err.details;

  res.status(status).json(response);
}
