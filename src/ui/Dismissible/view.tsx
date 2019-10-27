import {callHandler, EventHandler} from "common/Event";
import * as React from "react";

interface Props {
  hidden?: boolean;
  className?: string;
  children: React.ReactNode;

  onDismiss?: EventHandler;
}

export class Dismissible extends React.PureComponent<Props> {
  private doNotDismiss: boolean = false;

  componentDidMount (): void {
    window.addEventListener("click", this.handleGlobalClick);
  }

  componentWillUnmount (): void {
    window.removeEventListener("click", this.handleGlobalClick);
  }

  componentDidUpdate (prevProps: Readonly<Props>): void {
    if (prevProps.hidden != this.props.hidden) {
      this.doNotDismiss = true;
    }
  }

  private handleGlobalClick = () => {
    if (this.props.hidden) {
      return;
    }
    if (this.doNotDismiss) {
      this.doNotDismiss = false;
    } else {
      callHandler(this.props.onDismiss);
    }
  };

  private handleClick = () => {
    this.doNotDismiss = true;
  };

  render () {
    return (
      <div
        className={this.props.className}
        hidden={this.props.hidden}
        onClick={this.handleClick}
        children={this.props.children}
      />
    );
  }
}
