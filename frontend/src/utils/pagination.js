export const DEFAULT_PAGE = 1;

export const PAGE_LIMITS = {
  jobs: 9,
  table: 10,
  savedJobs: 7,
  appliedJobs: 7,
};

export const paginateArray = (items, page, limit) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

export const getTotalPages = (total, limit) =>
  Math.max(1, Math.ceil(total / limit));

export const emptyPagination = (limit = 10) => ({
  page: DEFAULT_PAGE,
  limit,
  total: 0,
  totalPages: 1,
});
