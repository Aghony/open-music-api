class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);  // Ensure consistent naming
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);  // Ensure consistent naming
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title = 'untitled', year, genre, performer, duration = null, albumId = null } = request.payload;

    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        songId
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs(title, performer);

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    }).code(200);
  }


  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return h.response({
      status: 'success',
      message: 'Lagu Berhasil dihapus',
    }).code(200);
  }
}

module.exports = SongsHandler;
