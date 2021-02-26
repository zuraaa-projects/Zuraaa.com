const { Router } = require('express');

const router = Router();

module.exports = (api) => {
  router.get('/:id', async (req, res) => {
    const response = await api.getAvatar(req.params.id);
    res.writeHead(200, {
      'Content-Type': response.contentType,
      'Content-Length': response.image.length,
    });
    res.end(response.image);
  });
  return router;
};
