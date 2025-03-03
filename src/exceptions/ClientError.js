class ClientError extends Error {  // Perbaiki nama class
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;  // Perbaiki nama export
