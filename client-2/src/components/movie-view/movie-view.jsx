import React from "react";
import { connect } from "react-redux";
import "./movie-view.scss";
import Button from "react-bootstrap/Button";
import Figure from "react-bootstrap/Figure";

import { Link } from "react-router-dom";

function MovieView(props) {
  const { movies, movieId } = props;

  if (!movies || !movies.length) return null;

  const movie = movies.find(m => m._id == movieId);

  return (
    <div className="movie">
      <Figure>
        <Figure.Image
          src={process.env.PUBLIC_URL + "/images/" + movie.ImagePath}
        />
        <Figure.Caption>
          <div className="movie-view">
            <div className="movie-title">
              <div className="label h5">Title</div>
              <div className="value">{movie.Title} </div>
            </div>
            <div className="movie-description">
              <div className="label h5">Description</div>
              <div className="value">{movie.Description} </div>
            </div>
            <div className="movie-genre">
              <div className="label h5">Genre</div>
              <div className="value">{movie.Genre.Name} *</div>
              <Link to={`/genres/${movie.Genre.Name}`}>
                <Button variant="link" className="details">
                  * What is {movie.Genre.Name}?
                </Button>
              </Link>
            </div>
            <div className="movie-director">
              <div className="label h5">Director</div>
              <div className="value">{movie.Director.Name} **</div>
              <Link to={`/directors/${movie.Director.Name}`}>
                <Button variant="link" className="details">
                  ** Click for {movie.Director.Name}'s brief biography
                </Button>
              </Link>
            </div>
          </div>
        </Figure.Caption>
      </Figure>
      <Link to={`/movielist`}>
        <Button className="back-button" variant="primary">
          Back to movies
        </Button>
      </Link>
    </div>
  );
}

export default connect(({ movies }) => ({ movies }))(MovieView);
