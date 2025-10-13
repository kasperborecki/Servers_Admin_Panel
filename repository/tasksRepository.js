export class TasksRepository {
  baseUrl = "https://localhost:44313/api/Tasks";

    async getAll(searchQuery, formattedDateRange, page, itemsPerPage, sortBy = [], sortDesc = []) {
    const params = {
      pageNumber: page,
      pageSize: itemsPerPage
    };

    if (searchQuery) params.name = searchQuery;
    if (formattedDateRange) params.dateRange = formattedDateRange;
    
    if (sortBy && sortBy.length > 0) {
      params.sortBy = sortBy;
    }
    if (sortDesc && sortDesc.length > 0) {
      params.sortDesc = sortDesc;
    }

    const data = await $fetch(this.baseUrl, {
      method: 'GET',
      params
    });

    return data;
  }


  async getById(id) {
    const data = await $fetch(`${this.baseUrl}/${id}`);
    return data;
  }

  async updateTask(updated) {
    const data = await $fetch(`${this.baseUrl}/${updated.id}`, {
      method: "PUT",
      body: {
        name: updated.name,
        createdAt: updated.createdAt,
        modifiedAt: updated.modifiedAt,
        serverId: updated.serverId,
        applicationId: updated.applicationId,
        description: updated.description,
      },
    });
    return data;
  }

  async addTask(task) {
    const data = await $fetch(`${this.baseUrl}`, {
      method: "POST",
      body: {
        name: task.name,
        createdAt: task.createdAt,
        modifiedAt: task.modifiedAt,
        serverId: task.serverId,
        applicationId: task.applicationId,
        description: task.description,
      },
    });
    return data;
  }

  async deleteTask(id) {
    const data = await $fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    return data;
  }
}
