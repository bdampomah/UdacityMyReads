import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { debounce } from 'throttle-debounce';
import * as BooksAPI from './BooksAPI';
import './App.css';
import ListBooks from './ListBooks';
import SearchBooks from './SearchBooks';

/*Declare variables that wont be assigned*/
const categories = [
  { key: 'currentlyReading', name: 'Currently Reading' },
  { key: 'wantToRead', name: 'Want to Read' },
  { key: 'read', name: 'Read' }
];

/*save properties that belongs to component*/

class BooksApp extends Component {
 state = {
    availableBooks: [],
    queryBooks: [],
    showSearchPage: false
  };
/*Invoke componentDidMount*/

  componentDidMount = () => {
    BooksAPI.getAll()
      .then(books => {
        this.setState({ availableBooks: books });
      })
      .catch(mistake => {
        console.log(mistake);
        this.setState({ showSearchPage: true });
      });
  };
  ChangeBookPosition = (book, shelf) => {
    BooksAPI.update(book, shelf).catch(mistake => {
      console.log(mistake);
      this.setState({ showSearchPage: true });
    });
    if (shelf === 'none') {
      this.setState(maintain => ({
        availableBooks: maintain.availableBooks.filter(a => a.id !== book.id)
      }));
    } else {
      book.shelf = shelf;
      this.setState(maintain => ({
        availableBooks: maintain.availableBooks.filter(a => a.id !== book.id).concat(book)
      }));
    }
  };
/*ensure that the actual onChange event callback is called
when the user has stopped inputting the characters */
 SearchForBooks = debounce(300, false, query => { 
    if (query.length > 0) {
      BooksAPI.search(query).then(books => {
        if (books.showSearchPage) {
          this.setState({ queryBooks: [] });
        } else {
          this.setState({ queryBooks: books });
        }
      });
    } else {
      this.setState({ queryBooks: [] });
    }
  });
  resetSearch = () => {
    this.setState({ queryBooks: [] });
  };

  render() {
    const { availableBooks, queryBooks, error } = this.state;
    if (error) {
      return <div>Sorry, Unavailable.</div>;
    }
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <ListBooks
              categories={categories}
              books={availableBooks}
              onMove={this.ChangeBookPosition}
            />
          )}
        />
        <Route
          path="/search"
          render={() => (
            <SearchBooks
              queryBooks={queryBooks}
              availableBooks={availableBooks}
              onSearch={this.SearchForBooks}
              onMove={this.ChangeBookPosition}
              onResetSearch={this.resetSearch}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
