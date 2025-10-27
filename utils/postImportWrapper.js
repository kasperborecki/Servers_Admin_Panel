export default async function fileApiFetch(url, options = {}) {
  const auth = useAuth();
  const token = auth.token.value;

  if (!(options.body instanceof FormData)) {
    console.error("fileApiFetch expects FormData as body!");
    throw new Error("Invalid body: expected FormData");
  }
  const headers = {
    Authorization: token ? `${token}` : "",
  };

  delete headers["Content-Type"];

  const response = await fetch(url, {
    method: options.method || "POST",
    headers,
    body: options.body,
  });

  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return response;
}