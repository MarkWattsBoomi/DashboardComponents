import * as React from 'react';

import './css/ModalDialog.css';

// Declaration of the component as React Class Component
class ModalDialog extends React.Component<any, any> {

    modal: any;
  // Init of the component before it is mounted.
    constructor(props: any) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  // Add listeners immediately after the component is mounted.
    componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  // Remove listeners immediately before a component is unmounted and destroyed.
    componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp, false);
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  // Handle the key press event.
    handleKeyUp(e: any) {
    const { onCloseRequest } = this.props;
    const keys = {
      27: () => {
        e.preventDefault();
        onCloseRequest();
        window.removeEventListener('keyup', this.handleKeyUp, false);
      },
    };

    // if (keys[e.keyCode]) { keys[e.keyCode](); }
  }

  // Handle the mouse click on browser window.
    handleOutsideClick(e: any) {
    const { onCloseRequest } = this.props;

    // if (!this.modal) {
    //  if (!this.modal.contains(e.target)) {
    //    onCloseRequest();
    //    document.removeEventListener('click', this.handleOutsideClick, false);
     // }
    // }
  }

  // Render the component passing onCloseRequest and children as props.
    render() {
    const {
      onCloseRequest,
      children,
      classes,
    } = this.props;

    return (
      <div className="modal-redaction">
        <div className="modal" ref={(node) => (this.modal = node)}>
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

// Export the component to use it in other components.
export default ModalDialog;
