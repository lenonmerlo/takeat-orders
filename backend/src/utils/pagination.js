import { ValidationError } from "../errors/ValidationError.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(query = {}) {
  const pageRaw = query.page ?? DEFAULT_PAGE;
  const limitRaw = query.limit ?? DEFAULT_LIMIT;

  const page = Number(pageRaw);
  const limit = Number(limitRaw);

  const errors = [];

  if (!Number.isInteger(page) || page <= 0) {
    errors.push({ field: "page", message: "page deve ser inteiro > 0" });
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    errors.push({ field: "limit", message: "limit deve ser inteiro > 0" });
  }

  if (Number.isInteger(limit) && limit > MAX_LIMIT) {
    errors.push({
      field: "limit",
      message: `limit deve ser <= ${MAX_LIMIT}`,
    });
  }

  if (errors.length) {
    throw new ValidationError("Parâmetros de paginação inválidos", errors);
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function buildPaginationMeta({ page, limit, total }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function buildPaginatedResponse({ rows, count, page, limit }) {
  return {
    data: rows,
    meta: buildPaginationMeta({ page, limit, total: count }),
  };
}
