module.exports = (query) => {
  const simpleBotQuery = '-details.longDescription -details.htmlDescription ';
  let filter = '-tokens';
  if (!query.buffer) { filter = `-avatarBuffer ${filter}`; }
  if (query.simple) { filter = simpleBotQuery + filter; }
  return filter;
};
