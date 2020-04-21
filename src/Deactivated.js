import PropTypes from "prop-types";
import React from "react";
import styles from "./Deactivated.css";

class Deactivated extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string,
    html: PropTypes.node,
  };

  static defaultProps = {
    message: "Deactivated",
  };

  state = {
    hasFocus: false,
  };

  render() {
    const { message, children, html } = this.props;
    const { hasFocus } = this.state;

    return (
      <div className={hasFocus ? styles.hasFocus : styles.noFocus}>
        <div className={styles.eventHandler}>
          <div className={styles.overlay} />
          {!html && <div className={styles.stringMessage}>{message}</div>}
          {html && <div className={styles.html}>{html}</div>}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}

export default Deactivated;
