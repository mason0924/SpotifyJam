const clientId = '9cbd6f8faad140ccbbb80d86cbfd4538';
let redirectUri = 'http://localhost:3000/'
// change the ID and redirectUri before publish
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // check for access token match
    // window.location.href to get current url
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken =  accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // This clears the parameters, allowing to grab a new access token when it expires.
      window.setTimeout(() => accessToken = '', expiresIn *1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessURL;
    }
  },

  search(input) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${input}`, { //fetch,plus second arguement
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {   //get the response and convert into JSON()
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) { // if returned JSON don't content tracks, simply return
        return [];  
      }
      return jsonResponse.tracks.items.map(eachTrack => ({
        id: eachTrack.id,
        name: eachTrack.name,
        artists: eachTrack.artists[0].name,
        album: eachTrack.album.name,
        uri: eachTrack.uri
      }));
    });
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {  //if no playlist name/ no uris, simply return 
      return
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, { headers: headers }  //second arguement header object
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;  //to get use ID
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        { headers: headers,
          method: 'POST',  // to requst create new playlist
          body: JSON.stringify({ name: playlistName})
        }).then(response => response.json() //convert the promise into json
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris})  // i think is return confirmation of playlist ID
          })
        }) 
    })
  }
}

export default Spotify;