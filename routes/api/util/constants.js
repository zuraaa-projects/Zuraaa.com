const rateLimitOptions = {
    get: { windowMs: 2 * 60 * 1000, max: 1 },
    gets: { windowMs: 5 * 60 * 1000, max: 1 },
    patch: { windowMs: 60 * 1000, max: 1 },
    post: { windowMs: 60 * 1000, max: 1 },
    put: { windowMs: 60 * 1000, max: 1 },
}


module.exports = {
    rateLimitOptions
}