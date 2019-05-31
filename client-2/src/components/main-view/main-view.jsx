import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import { setMovies, setUser } from "../../actions/actions";
import LoginView from "../login-view/login-view";
import RegistrationView from "../registration-view/registration-view";
import MoviesList from "../movies-list/movies-list";
import MovieView from "../movie-view/movie-view";
import DirectorView from "../director-view/director-view";
import GenreView from "../genre-view/genre-view";
import ProfileUpdate, { ConnectedProfileView, ProfileDelete } from "../profile-view/profile-view";

import { Button, Navbar, Nav, Collapse } from "react-bootstrap";
import "./main-view.scss";

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      token: null,
      user: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      let user = localStorage.getItem("user");
      this.setState({
        user: user
      });
      this.getMovies(accessToken);
      this.getUser(user, accessToken);
    }
  }

  getMovies(token) {
    axios
      .get("https://cinestock.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getUser(user, token) {
    axios
      .get("https://cinestock.herokuapp.com/users/" + user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setUser(response.data);
        this.setState({
          token: token
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onUpdate(user) {
    localStorage.setItem("user", user);
  }

  onLoggedIn = authData => {
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  };

  onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      user: null,
      token: null
    });
  }

  onDelete() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      token: null
    });
  }

  render() {
    const { user, open, token } = this.state;

    if (!user)
      return (
        <div className="login-page">
          <div className="container">
            <div className="label h5">
              <br />
              Welcome to CineStock!
            </div>
            <div className="value">
              <p> Please log into your account:</p>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </div>
          </div>
          <div className="container">
            <div className="label">
              New to Cinestock? Please
              <Button onClick={() => this.setState({ open: !open })} aria-controls="example-collapse-text" aria-expanded={open} variant="link">register</Button>to explore our world of cinema.
            </div>
            <Collapse in={this.state.open}>
              <div className="value">
                <RegistrationView onLoggedIn={user => this.onLoggedIn(user)} />
              </div>
            </Collapse>
          </div>
        </div>
      );

    if (user && !token) return <Router />;

    return (
      <Router>
        <div className="main-view">
          <Navbar collapseOnSelect sticky="top" expand="sm" variant="dark">
            <Navbar.Brand href="/">
              <Button onClick={() => this.onLogout()} className="logout-btn" variant="primary">Log out</Button>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto" justify variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="disabled" disabled>Hello, {user}!</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/userprofile">Your account</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={NavLink} to={process.env.PUBLIC_URL + "/movielist"}>Movies</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" render={() => <MoviesList token={token} />} />
          <Route exact path="/movielist" render={() => <MoviesList token={token} />} />
          <Route exact path="/movielist/:movieId"
            render={({ match }) => <MovieView movieId={match.params.movieId} />} />
          <Route exact path="/userprofile"
            render={() => <ConnectedProfileView token={token} />} />
          <Route exact path="/userprofile/update"
            render={() => (<ProfileUpdate token={token} onUpdate={user => this.onUpdate(user)} />)} />
          <Route exact path="/userprofile/delete" render={() => (
            <ProfileDelete user={user} onDelete={user => this.onDelete(user)} />)} />
          <Route path="/directors/:name" render={({ match }) => (
            <DirectorView directorName={match.params.name} />)} />
          <Route path="/genres/:name" render={({ match }) =>
            <GenreView genreName={match.params.name} />} />
        </div>
      </Router>
    );
  }
}

export default connect(null, { setMovies, setUser })(MainView);
