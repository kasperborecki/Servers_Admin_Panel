import apiFetch from "../utils/fetchWrapper";

export class ExportRepository {
  baseUrl = "http://localhost:5052/api/Export/servers";

  async exportServersToExcel(serverIds) {

    const response = await apiFetch(this.baseUrl, {
      method: "POST",
      body: serverIds,
      responseType: "blob", 
    });

    console.log(response)

    const filename = this._extractFilename(response) || "servers_export.xlsx";

    const urlObject = window.URL.createObjectURL(response);
    const a = document.createElement("a");
    a.href = urlObject;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlObject);
  }

  _extractFilename(response) {
    const disposition = response.headers?.get("Content-Disposition");
    if (!disposition) return null;

    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    return match ? match[1].replace(/['"]/g, "") : null;
  }
}
