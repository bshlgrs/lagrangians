import React, { Component } from 'react';
import './InputWithValidation.css';

class InputWithValidation extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue }
  }

  componentDidReceiveProps (props) {
    this.state = { value: this.props.initialValue }
  }

  onChange(v) {
    if (this.props.isValid(v)) {
      this.props.onChange(v);
    }
    this.setState({ value: v });
  }

  render () {
    return <input
      className={this.props.isValid(this.state.value) || "invalid-input"}
      value={this.state.value}
      onChange={(e) => this.onChange(e.target.value)}
      />
  }
}

class NumericInput extends Component {
  render() {
    return <InputWithValidation
       isValid={(v) => !isNaN(parseFloat(v))}
       onChange={(v) => this.props.onChange(parseFloat(v))}
       initialValue={this.props.initialValue}
      />
  }
}

export { InputWithValidation, NumericInput }
