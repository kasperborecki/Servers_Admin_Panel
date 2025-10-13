export class ServerRepository {
  baseUrl = 'https://localhost:44313/api/Servers'

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

    async getAllCombined(searchQuery, formattedDateRange, page, itemsPerPage, sortBy = [], sortDesc = []) {
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

    const data = await $fetch(this.baseUrl + "/get-all-combined", {
      method: 'GET',
      params
    });

    return data;
  }

  


  async getById(id) {
    const data = await $fetch(`${this.baseUrl}/${id}`)
    return data
  }
  

  async addServer(server){
    console.log(server)
    const data = await $fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: {
        name : server.name,
        createdAt : server.createdAt,
        modifiedAt : server.modifiedAt,
        statusId : server.status,
        country : server.country,
        ipAddress : server.ipAddress,
        os : server.os,
        cpuCores : server.cpuCores,
        ramVolumeId : server.ramGB,
        location : server.location
      }
    })
    return data
  }

    async updateServer(updated){
    const data = await $fetch(`${this.baseUrl}/${updated.id}`, {
      method: 'PUT',
      body: {
        name : updated.name,
        createdAt : updated.createdAt,
        modifiedAt : updated.modifiedAt,
        statusId : updated.status,
        country : updated.country,
        ipAddress : updated.ipAddress,
        os : updated.os,
        cpuCores : updated.cpuCores,
        ramVolumeId : updated.ramVolumeId,
        location : updated.location
      }
    })
    return data
  }

  async deleteServer(id) {
    const data = await $fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    })
    return data
  }

  async getAllRamVolumes(){
    const data = await $fetch(`https://localhost:44313/api/Servers/AllRamVolume`)
    return data
  }

  async getAllServersIds(){
    const data = await $fetch(`https://localhost:44313/api/Servers/ServersIds`)
    return data
  }
}

