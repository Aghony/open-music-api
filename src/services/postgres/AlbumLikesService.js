const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }
  async addLikeInAlbumById({ userId, albumId }) {
    const id = `albumlike-${ nanoid(16) }`;

    // Cek apakah album ada
    await this.checkAlbumExistence(albumId);

    // Cek apakah album sudah disukai
    await this.checkAlbum(userId, albumId);

    const query = {
      text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);

    return result.rows[0].id;
  }

  async getLikesInAlbumById(albumId) {
    let cache = false; // Defaultnya dianggap tidak dari cache

    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);

      cache = true;
      return { likes: parseInt(result, 10), cache };
    } catch {


      const query = {
        text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].likes, 10); // Gunakan alias likes

      await this._cacheService.set(`albumLikes:${albumId}`, likes);

      return { likes, cache };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tidak dapat membatalkan suka album. Id tidak ditemukan');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async checkAlbumExistence(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async checkAlbum(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new InvariantError('Gagal menyukai album yang sama');
    }
  }
}

module.exports = AlbumLikesService;