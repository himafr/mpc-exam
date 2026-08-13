/**
 * Resolves pagination parameters with defaults
 * @param {Object} params - Pagination parameters
 * @param {number} [params.page] - Page number (default: 1)
 * @param {number} [params.limit] - Items per page (default: 20, max: 100)
 * @returns {Object} Resolved pagination object
 */
export function resolvePagination({ page, limit }) {
  const resolvedPage = page && page > 0 ? page : 1;
  const resolvedLimit = limit && limit > 0 && limit <= 100 ? limit : 20;
  const offset = (resolvedPage - 1) * resolvedLimit;
  return { page: resolvedPage, limit: resolvedLimit, offset };
}

/**
 * Builds pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination metadata
 */
export function buildMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}