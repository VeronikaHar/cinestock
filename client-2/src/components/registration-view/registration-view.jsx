import React, { useState } from "react";
import { connect } from "react-redux";
import { setShowModal, setTrigger } from "../../actions/actions";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

// Axios is a package to send client requests; it hooks frontend code up with API
import axios from "axios";

function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  let show = null,
    modalBody =
      "Registration error. Please try again with a different username.";

  if (props.trigger === "400") {
    show = props.showModal;
    modalBody =
      "The user with such username already exists. Please pick a different username that only contains letters and/or numbers.";
  }
  if (props.trigger === "422") {
    show = props.showModal;
    modalBody = "Please fill out all the required fields and try again.";
  }

  const handleRegister = e => {
    e.preventDefault();
    axios
      .post("https://cinestock.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
      .then(() => {
        axios
          .post("https://cinestock.herokuapp.com/login", {
            Username: username,
            Password: password
          })
          .then(response => {
            const data = response.data;
            props.onLoggedIn(data);
            window.open("/movielist", "_self");
          });
      })
      .catch(e => {
        props.setShowModal(true);
        let check = e.toString().includes("400");
        if (check) {
          props.setTrigger("400");
        } else {
          props.setTrigger("422");
        }
        console.log(e, "Error registering the user.");
      });
  };

  const handleClose = () => {
    props.setShowModal(false);
  };

  return (
    <Form>
      <p>Asterisk (*) marks required fields.</p>
      <Form.Group controlId="formUsername">
        <Form.Label>Username*: </Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Pick a username"
        />
        <Form.Text className="text-muted">
          Username can only contain alphanumeric characters (A-Za-z, 0-9).
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password*: </Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Pick a password"
        />
        <Form.Text className="text-muted">
          Password should be at least 8 characters long.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email*: </Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Please provide your email"
        />
      </Form.Group>
      <Form.Group controlId="formBirthday">
        <Form.Label>Birthday: </Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          placeholder="Please provide your birthday in format mm/dd/yyyy"
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleRegister}>
        Register
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Error registering!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Form.Text className="text-muted">
        We will never share your personal information with anyone.
      </Form.Text>
    </Form>
  );
}

export default connect(
  ({ showModal, trigger }) => ({ showModal, trigger }),
  { setShowModal, setTrigger }
)(RegistrationView);
