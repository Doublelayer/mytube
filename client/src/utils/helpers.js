export const renameKeys = (obj, newKeys) => {
  if (!obj) {
    return [];
  }
  const keyValues = Object.keys(obj).map((key) => {
    let newKey = null;
    if (key === 'path') {
      newKey = newKeys.path;
    } else if (key === 'name') {
      newKey = newKeys.name;
    } else {
      newKey = key;
    }
    if (key === 'children') {
      obj[key] = obj[key].map((obj) => renameKeys(obj, newKeys));
    }
    return {
      [newKey]: obj[key],
    };
  });
  return Object.assign({}, ...keyValues);
};
