const path = require('path');
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      }
    },
  },
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.resolve(process.cwd(), 'src/api/uploads/file/images'), // ✅ Pakai process.cwd() untuk path absolut
        listing: true, // ✅ Sementara aktifkan untuk debugging
        index: false,
      },
    },
  },
];

module.exports = routes;