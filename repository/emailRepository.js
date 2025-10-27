import apiFetch from "../utils/fetchWrapper";

export class EmailRepository {
  baseUrl = "http://localhost:5052/api/Email";

  async getPagedPdfs(
    searchQuery,
    page,
    itemsPerPage,
    sortBy = [],
    sortDesc = []
  ) {
    const params = {
      pageNumber: page,
      pageSize: itemsPerPage,
      ...(searchQuery ? { name: searchQuery } : {}),
      ...(sortBy.length ? { sortBy } : {}),
      ...(sortDesc.length ? { sortDesc } : {}),
    };

    return apiFetch(this.baseUrl + "/getPdfs" , { method: "GET", params });
  }
}
