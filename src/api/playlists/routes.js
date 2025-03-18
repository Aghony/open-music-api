const routes = (handler) => [{
  method: 'POST',
  path: '/playlists',
  handler: handler.postPlaylistHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists',
  handler: handler.getPlaylistsHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{id}',
  handler: handler.getPlaylistByIdHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{id}',
  handler: handler.deletePlaylistByIdHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},

{
  method: 'POST',
  path: '/playlists/{playlistId}/songs',
  handler: handler.postPlaylistSongHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{playlistId}/songs',
  handler: handler.getPlaylistSongsHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}/songs',
  handler: handler.deletePlaylistSongByIdHandler,
  options: {
    auth: 'playlistsapp_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{id}/activities',
  handler: handler.getPlaylistActivitiesHandler,
  options: {
    auth: 'playlistsapp_jwt'
  }
},
];

module.exports = routes;