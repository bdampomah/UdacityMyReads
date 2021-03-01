import React from 'react';
import Book from './Book';

const SearchResults = props => {
  const { queryBooks, availableBooks, onMove } = props;

  const outputBooks = queryBooks.map(book => {
    availableBooks.map(a => {
      if (a.id === book.id) {
        book.shelf = a.shelf;
      }
      return a;
    });
    return book;
  });
  return (
    <div className="search-books-results">
      <ol className="books-grid">
        {outputBooks.map(book => (
          <Book
            key={book.id}
            book={book}
            shelf={book.shelf ? book.shelf : 'none'}
            onMove={onMove}
          />
        ))}
      </ol>
    </div>
  );
};

export default SearchResults;
