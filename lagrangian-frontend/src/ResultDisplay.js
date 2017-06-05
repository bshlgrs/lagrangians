import React, { Component } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

class ResultDisplay extends Component {
  render () {
    const result = this.props.result;

    return <div>
      <p><Katex value={"E_K = " + result.kinetic_energy}/></p>
      <p><Katex value={"E_K = " + result.potential_energy}/></p>
      <p><Katex value={"\\mathcal{L} = " + result.lagrangian}/></p>
      <p>Equations of motion</p>
      {Object.keys(result.equations_of_motion).map((x, idx) =>
        <p key={idx}>
          <Katex value={`\\ddot{${x}} = ${result.equations_of_motion[x]}`} />
        </p>
      )}
    </div>
  }
}

class Katex extends Component {
  render() {
    return <span dangerouslySetInnerHTML={{__html:
            katex.renderToString(this.props.value) }} />
  }
}

export default ResultDisplay;
