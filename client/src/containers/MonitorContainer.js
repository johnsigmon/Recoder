/*import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import Poti from '../components/Poti';

export default class MonitorContainer extends Component {
  constructor(props) {
    super(props);
/*    this.envelope = new Tone.AmplitudeEnvelope({
      attack : 0.41,
      decay : 0.21,
      sustain : 0.9,
      release : .9
    }).toMaster()*/
    this.state = {
      views: {
        0: 1
      }
    };

    this.viewType = this.viewType.bind(this);


  }
  viewType( osc, v) {

     let views = this.state.views;
    views[osc] = v;

    this.setState({
      views: views
    });

  }
  render() {
    return (
      <Col md={6} lg={6} style={{backgroundColor: 'lightgreen', height: '50%', position: 'relative', padding: '0', margin: '0'}}>
        <Col md={2} lg={2}>
          <h4>View Controls</h4>
          <Col md={12}>
                    <Poti className='_colored yellow'
                range={[0,3]}
                size={60}
                label={'waveform'}
                snap={true}
                fullAngle={300}
                steps={[{label:'SPEC'},{label:'OSC'},{label:'tri'},{label:'saw'}]}
                onChange={ this.viewType.bind(this, 0) }
                value={ this.state.views[0]} />
          </Col>
        </Col>
        <Col md={10} lg={10}>
        <canvas id='synthview' height='300px' width='500px'></canvas>
        </Col>
      </Col>
    );
  }
}
*/
