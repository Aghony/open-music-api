const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const query = {
      text: 'INSERT INTO albums (name, year) VALUES ($1, $2) RETURNING id',
      values: [name, year],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getAlbumsById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album Not Found');
    }
    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE albums_id = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(querySongs);
    const mappedResult= {
      id: result.rows[0].id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      songs: resultSongs.rows,
    };
    return mappedResult;
  }

  async updatedAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id){
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;