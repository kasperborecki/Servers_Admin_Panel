import apiFetch from "../utils/fetchWrapper";

export class TasksRepository {
  baseUrl = "http://localhost:5052/api/Tasks";

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

  async getById(id) {
    return apiFetch(`${this.baseUrl}/${id}`, { method: "GET" });
  }

  async addTask(task) {
    const body = {
      name: task.name,
      createdAt: task.createdAt,
      modifiedAt: task.modifiedAt,
      serverId: task.serverId,
      applicationId: task.applicationId,
      description: task.description,
    };

    return apiFetch(this.baseUrl, { method: "POST", body });
  }

  async updateTask(updated) {
    const body = {
      name: updated.name,
      createdAt: updated.createdAt,
      modifiedAt: updated.modifiedAt,
      serverId: updated.serverId,
      applicationId: updated.applicationId,
      description: updated.description,
    };

    return apiFetch(`${this.baseUrl}/${updated.id}`, { method: "PUT", body });
  }

  async deleteTask(id) {
    return apiFetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
  }
}
