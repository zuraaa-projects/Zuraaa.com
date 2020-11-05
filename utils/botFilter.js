module.exports = (query) => {
    let filter = "-tokens";
    if (!query.buffer)
        filter = "-avatarBuffer " + filter
    if (query.simple)
        filter = simpleBotQuery + filter
    return filter;
}
