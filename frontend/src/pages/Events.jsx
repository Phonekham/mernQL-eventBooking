import React, { Component } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

class Events extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
  };
  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop></Backdrop>}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onConfirm={this.modalConfirmHandler}
            onCancel={this.modalCancelHandler}
          ></Modal>
        )}
        <div className="events-control">
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Events;
