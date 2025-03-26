const Joi = require('joi');

const AlbumLikesPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  albumId: Joi.string().required(),
});

module.exports = { AlbumLikesPayloadSchema };