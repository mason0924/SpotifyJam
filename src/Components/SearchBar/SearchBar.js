import React from 'react';

import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  search() {
    this.props.onSearch(this.state.input);
  }

  handleTermChange(event) {
    this.setState({ input: event.target.value })
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ input: event.target.value })
  }

  render() {
    return (
      <form action="" onSubmit={this.onSubmit}>
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist :-)" onChange={this.handleTermChange}/>
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
      </form>
    )
  }
}

export default SearchBar;