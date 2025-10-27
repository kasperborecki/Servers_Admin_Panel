export default async function apiFetch(url, options = {}) {
  const auth = useAuth();

  const token = auth.token.value;
  const defaultHeaders = {
    Authorization: token ? `${token}` : "",
    "Content-Type": "application/json",
  };

  return $fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });
}
