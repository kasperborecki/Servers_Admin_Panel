import apiFetch from "../utils/fetchWrapper";
import fileApiFetch from "~/utils/postImportWrapper";

export class ImportsRepository {
  baseUrl = "http://localhost:5052";

  async getPagedImports(
    phrase,
    page,
    itemsPerPage,
    sortBy = [],
    sortDesc = [],
    type,
    dateTo,
    dateFrom
  ) {
    const params = {
      pageNumber: page,
      pageSize: itemsPerPage,
      type: type,

      ...(phrase ? { name: phrase } : {}),
      ...(dateTo ? { dateTo: dateTo } : {}),
      ...(dateFrom ? { dateFrom: dateFrom } : {}),
      ...(sortBy.length ? { sortBy } : {}),
      ...(sortDesc.length ? { sortDesc } : {}),
    };

    return apiFetch(`${this.baseUrl}/imports`, {
      method: "POST",
      params,
    });
  }

  async downloadFile(item) {
    const res = await apiFetch(`${this.baseUrl}/${item.id}/file`, {
      method: "GET",
      responseType: "blob",
    });

    if (!res || res.error) {
      snack.error("Download failed");
      return;
    }

    const blobUrl = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", item.filename);
    document.body.appendChild(link);
    link.click();
  }

  async restartImport(id) {
    const res = await apiFetch(`${this.baseUrl}/${id}/restartImport`, {
      method: "PUT",
    });

    if (res.success) {
      snack.success(t("imports.restartSuccess"));
    } else {
      snack.error(t("imports.restartFailed"));
    }
  }

async importDocuments(type, file) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const response = await fileApiFetch(`${this.baseUrl}/internal/${type}`, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (err) {
    console.error("Import error:", err);
    throw err;
  }
}
}
