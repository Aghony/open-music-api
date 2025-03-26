class AlbumLikesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserAlbumLikeHandler = this.postUserAlbumLikeHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
    this.deleteUserAlbumLikeHandler = this.deleteUserAlbumLikeHandler.bind(this);
  }

  async postUserAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkAlbumExistence(id);
    await this._service.addLikeInAlbumById({ albumId: id, userId: credentialId });
    const response = h.response({
      status: 'success',
      message: 'Like di album berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getUserAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const { likes, cache } = await this._service.getLikesInAlbumById(id);

    const response = h.response({
      status: 'success',
      data: { likes },
    });

    return cache ? response.header('X-Data-Source', 'cache') : response;
  }
  async deleteUserAlbumLikeHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.deleteAlbumLike(userId, albumId);

    return {
      status: 'success',
      message: 'Batal menyukai album',
    };
  }
}

module.exports = AlbumLikesHandler;
