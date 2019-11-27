export const getSearchParam = (location, name) => {
  if (!location || !location.search) {
    return null;
  }
  console.log(location.search);

  const searchParams = new URLSearchParams(location.search);
  const n = searchParams.get(name);
  console.log(n);

  return n;
};
