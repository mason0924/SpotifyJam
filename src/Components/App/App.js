import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
      image:[],
      userName: '',
      userImage:'',
      // loginStatus: Spotify.loginStatus(),
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.logout = this.logout.bind(this);
  }

  addTrack(track) {
    let tracksInfo = this.state.playlistTracks;
    if (tracksInfo.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracksInfo.push(track);
    this.setState({playlistTracks: tracksInfo});
  }

  removeTrack(track) {
    let tracksInfo = this.state.playlistTracks;
    tracksInfo = tracksInfo.filter(savedTrack => savedTrack.id !== track.id);

    this.setState({ playlistTracks: tracksInfo });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(eachTrack => eachTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then( () => {
      this.setState({ 
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(input) {
   Spotify.search(input).then(searchResults => {  //the received search results will pass into the state
     this.setState({ searchResults: searchResults});
   });
    // Spotify.getUserData()
   Spotify.getUserData().then(userData => {
     this.setState({ userName: userData.display_name, userImage: userData.images[0].url})
     console.log(this.state.userImage)
   });
  }

  logout() {
    Spotify.logout();
  }

  render() {
    return (
      <div>
        <div className="App">
        <h1>Spotify Jam!</h1>
        <div className="user">
        <img src={this.state.userImage} alt="" />
            <h2>{this.state.userName ? `Hi ${this.state.userName[0].toUpperCase()}${this.state.userName.slice(1)}` : '' }</h2>
        </div>
          {/* <button onClick={this.logout}>{this.state.loginStatus? 'Log in' : 'Log out'}</button> */}
        <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;