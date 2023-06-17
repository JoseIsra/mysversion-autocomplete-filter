const API = "https://gutendex.com/books/?search=";

export async function getAutoCompleteResults({ query, signal }) {
  // if (Math.random() < 0.8) {
  //   throw new Error("Algo salió mal muy mal");
  //   return;
  // }
  if (!query) return [];
  const res = await fetch(`${API}${query}`, { signal });
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (res.ok) {
    return await res.json();
  }
  throw new Error("ALGO SALIÓ MAL u.u");
}
