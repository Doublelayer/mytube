function isDevMode() {
  if (process.env.NODE_ENV === 'dev') return true;
  return false;
}

module.exports = {
  isDevMode
};
