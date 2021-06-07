import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList'

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleNameChange = this.handleNameChange.bind(this)
  }
  
  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }
  render() {
    return (
      <div className="Playlist">
        <input defaultValue={this.props.playlistName} onChange={this.handleNameChange}/>
        <TrackList trackResults={this.props.playlistTracks} 
        onRemove={this.props.onRemove}
          isRemoval={true}/>
        <button className="Playlist-save">Save to Spotify</button>
      </div>
    )
  }
}

export default Playlist;