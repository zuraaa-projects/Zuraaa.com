module.exports = (query) => {
    let filter = "-tokens";
    if (query.buffer === undefined)
        filter = "-avatarBuffer " + filter
    if (query.simple !== undefined)
        filter = simpleBotQuery + filter
    return filter;
}