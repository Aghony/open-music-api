const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSongs } = require('../../utils');
// const { AlbumPayloadsSchema } = require('../../validator/albums/schema');

class SongsService{
  constructor() {
    this._pool = new Pool();
  }
  async addSong({ title, year, performer, genre, duration, albumId })
  {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, &9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt,],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSong() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.ma(mapDBToModelSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
    return result.rows.map(mapDBToModelSongs)[0];
  }

  async editSongById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text : 'UPDATE song SET title=$1, body=$2, tags=$3, updated_at=$4 WHERE id=$5 RETURNING id',
      values: [title, body, tags, updatedAt, id], // Sekarang variabel ini didefinisikan sebagai parameter
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }


  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;