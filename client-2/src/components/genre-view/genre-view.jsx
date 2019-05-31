import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import "./genre-view.scss";

import { Link } from "react-router-dom";

function GenreView(props) {
  let movies = props.movies,
    genre = null;
  if (movies) {
    genre = movies.find(m => m.Genre.Name === props.genreName);
  }
  return (
    <div className="genre">
      <div className="container">
        <div className="label h5">{props.genreName}</div>
        <div className="value">{genre.Genre.Description}</div>
        <Link to={`/movielist`}>
          <Button className="back-button" variant="primary">
            Back to movie list
          </Button>
        </Link>
      </div>
    </div>
  );
}

GenreView.propTypes = {
  genreName: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired
};

export default connect(({ movies }) => ({ movies }))(GenreView);
