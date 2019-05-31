import React, { useState } from "react";
import { connect } from "react-redux";
import { setShowModal, setTrigger } from "../../actions/actions";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./login-view.scss";

// Axios is a package to send client requests; it hooks frontend code up with API
import axios from "axios";

function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let show = null;

  if (props.trigger === "on") {
    show = props.showModal;
  }

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("https://cinestock.herokuapp.com/login", {
        Username: username,
        Password: password
      })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
        window.open("/movielist", "_self");
      })
      .catch(e => {
        props.setTrigger("on");
        props.setShowModal(true);
        console.log(e);
      });
  };

  const handleClose = () => {
    props.setShowModal(false);
  };

  return (
    <Form>
      <Form.Group controlId="loginUsername">
        <Form.Label>Username: </Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </Form.Group>
      <Form.Group controlId="loginPassword">
        <Form.Label>Password: </Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Log in
      </Button>
      <Modal
        className="login-error"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Error logging in!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Incorrect username or password. Please try again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}

export default connect(
  ({ showModal, trigger }) => ({ showModal, trigger }),
  { setShowModal, setTrigger }
)(LoginView);
