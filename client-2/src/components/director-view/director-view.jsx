import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import "./director-view.scss";

import { Link } from "react-router-dom";

function DirectorView(props) {
  let movies = props.movies,
    director = null;
  if (movies) {
    director = movies.find(m => m.Director.Name === props.directorName);
  }
  const death = director.Director.Death ? director.Director.Death : "now";

  return (
    <div className="director">
      <div className="container">
        <div className="label h5">
          {props.directorName} ({director.Director.Birth} - {death})
        </div>
        <div className="value">{director.Director.Bio}</div>
        <Link to={`/movielist`}>
          <Button className="back-button" variant="primary">
            Back to movie list
          </Button>
        </Link>
      </div>
    </div>
  );
}

DirectorView.propTypes = {
  directorName: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired
};

export default connect(({ movies }) => ({ movies }))(DirectorView);
