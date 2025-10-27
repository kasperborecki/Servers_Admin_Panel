import apiFetch from "../utils/fetchWrapper";

export class ApplicationRepository {
  baseUrl = "http://localhost:5052/api/Application";

  async getAll(searchQuery, formattedDateRange, page, itemsPerPage, sortBy = [], sortDesc = []) {
    const params = {
      pageNumber: page,
      pageSize: itemsPerPage,
      ...(searchQuery ? { name: searchQuery } : {}),
      ...(formattedDateRange ? { dateRange: formattedDateRange } : {}),
      ...(sortBy.length ? { sortBy } : {}),
      ...(sortDesc.length ? { sortDesc } : {}),
    };

    return apiFetch(this.baseUrl, { method: "GET", params });
  }

  async addApplication(application) {
    const body = {
      name: application.name,
      createdAt: application.createdAt,
      modifiedAt: application.modifiedAt,
      serverId: application.serverId,
    };

    return apiFetch(this.baseUrl, { method: "POST", body });
  }

  async updateApplication(application) {
    const body = {
      name: application.name,
      createdAt: application.createdAt,
      modifiedAt: application.modifiedAt,
      serverId: application.serverId,
    };

    return apiFetch(`${this.baseUrl}/${application.id}`, { method: "PUT", body });
  }

  async deleteApplication(id) {
    return apiFetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
  }

  async getAllApplicationsIds() {
    return apiFetch(`${this.baseUrl}/ApplicationsIds`, { method: "GET" });
  }
}
