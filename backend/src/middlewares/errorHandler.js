export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  res.status(status).json({
    error: err.code || "INTERNAL_ERROR",
    message: err.message || "Erro interno",
  });
}
