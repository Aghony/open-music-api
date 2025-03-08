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
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
    };
    console.log(query);

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let baseQuery = 'SELECT id, title, performer FROM songs';
    const values = [];
    const conditions = [];

    if (title) {
      conditions.push(`LOWER(title) LIKE LOWER($${values.length + 1})`);
      values.push(`%${title}%`);
    }

    if (performer) {
      conditions.push(`LOWER(performer) LIKE LOWER($${values.length + 1})`);
      values.push(`%${performer}%`);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${  conditions.join(' AND ')}`;
    }

    const query = {
      text: baseQuery,
      values,
    };

    const result = await this._pool.query(query);
    return result.rows;
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

  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(`Gagal memperbarui lagu. Id ${id} tidak ditemukan`);
    }

    return result.rows[0].id;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = SongsService;