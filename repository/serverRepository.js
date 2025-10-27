import apiFetch from "../utils/fetchWrapper";

export class ServerRepository {
  baseUrl = "http://localhost:5052/api/Servers";

  async getAll(
    searchQuery,
    formattedDateRange,
    page,
    itemsPerPage,
    sortBy = [],
    sortDesc = []
  ) {
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

  async getAllCombined(
    searchQuery,
    formattedDateRange,
    page,
    itemsPerPage,
    sortBy = [],
    sortDesc = []
  ) {
    const params = {
      pageNumber: page,
      pageSize: itemsPerPage,
      ...(searchQuery ? { name: searchQuery } : {}),
      ...(formattedDateRange ? { dateRange: formattedDateRange } : {}),
      ...(sortBy.length ? { sortBy } : {}),
      ...(sortDesc.length ? { sortDesc } : {}),
    };

    return apiFetch(`${this.baseUrl}/get-all-combined`, {
      method: "GET",
      params,
    });
  }

  async addServer(server) {
    const body = {
      name: server.name,
      createdAt: server.createdAt,
      modifiedAt: server.modifiedAt,
      statusId: server.status,
      country: server.country,
      ipAddress: server.ipAddress,
      os: server.os,
      cpuCores: server.cpuCores,
      ramVolumeId: server.ramGB,
      location: server.location,
    };

    return apiFetch(this.baseUrl, { method: "POST", body });
  }

  async updateServer(updated) {
    const body = {
      name: updated.name,
      createdAt: updated.createdAt,
      modifiedAt: updated.modifiedAt,
      statusId: updated.status,
      country: updated.country,
      ipAddress: updated.ipAddress,
      os: updated.os,
      cpuCores: updated.cpuCores,
      ramVolumeId: updated.ramVolumeId,
      location: updated.location,
    };

    return apiFetch(`${this.baseUrl}/${updated.id}`, { method: "PUT", body });
  }

  async getById(id) {
    return apiFetch(`${this.baseUrl}/${id}`, { method: "GET" });
  }

  async deleteServer(id) {
    return apiFetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
  }

  async getAllRamVolumes() {
    return apiFetch(`${this.baseUrl}/AllRamVolume`, { method: "GET" });
  }

  async getAllServersIds() {
    return apiFetch(`${this.baseUrl}/ServersIds`, { method: "GET" });
  }
}
