class UploadsHandler {
  constructor(storageService, albumsService,  validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    if (!cover) {
      const response = h.response({
        status: 'fail',
        message: 'Gambar tidak ditemukan dalam payload',
      });
      response.code(400);
      return response;
    }
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/files/images/${filename}`;
    console.log('File Location:', fileLocation); // Debugging

    await this._albumsService.uploadCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation,
      }
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;