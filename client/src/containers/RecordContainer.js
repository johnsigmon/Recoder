import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';
/*import Poti from '../components/Poti';*/

export default class RecordContainer extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <Col md={12} style={{margin: '0', padding: '0'}}>

        <Button className='record'>Record</Button>
        <Button className='stop'>Stop</Button>
        <Button className='soundClips'></Button>
        <canvas className='visualizer'></canvas>
        <canvas className='myTrackCanvas'></canvas>


      </Col>
    );
  }
}

