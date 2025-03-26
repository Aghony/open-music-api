const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id){
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async uploadCoverById(albumId, coverUrl) {
    const relativeCoverUrl = `${coverUrl.split('\\').pop()}`;
    console.log('Saving coverUrl:', coverUrl);
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [relativeCoverUrl, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async getAlbumsById(id) {
    const queryAlbums = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const result = await this._pool.query(queryAlbums);
    const resultSongs = await this._pool.query(querySongs);
    console.log('🔍 Hasil Query Album:', result.rows);
    if (!result.rowCount) {
      throw new NotFoundError('Album Not Found');
    }
    const mappedResult= {
      id: result.rows[0].id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      coverUrl: result.rows[0].cover ? `http://localhost:5000/uploads/${result.rows[0].cover}` : null,
      songs: resultSongs.rows,
    };
    return mappedResult;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(`Gagal memperbarui album. ID ${id} tidak ditemukan.`);
    }

    return result.rows[0].id;
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