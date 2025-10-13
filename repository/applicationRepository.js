export class ApplicationRepository {
  baseUrl = "https://localhost:44313/api/Application";

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

  async updateApplication(application) {
    const data = await $fetch(`${this.baseUrl}/${application.id}`, {
      method: "PUT",
      body: {
        name: application.name,
        createdAt: application.createdAt,
        modifiedAt: application.modifiedAt,
        serverId: application.serverId,
      },
    });
    return data;
  }

    async addApplication(application) {
    const data = await $fetch(`${this.baseUrl}`, {
      method: "POST",
      body: {
        name: application.name,
        createdAt: application.createdAt,
        modifiedAt: application.modifiedAt,
        serverId: application.serverId,
      },
    });
    return data;
  }

  async deleteApplication(id) {
    const data = await $fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    return data;
  }

  async getAllApplicationsIds() {
    const data = await $fetch(
      `https://localhost:44313/api/Application/ApplicationsIds`
    );
    return data;
  }
}
