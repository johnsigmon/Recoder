import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import RecordContainer from './RecordContainer';
import BeatContainer from './BeatContainer';
export default class Main extends Component {
  render() {
    return (

      <Row style={{backgroundColor: 'darkgrey', padding: '0', margin: '0'}}>

        <BeatContainer />

        <RecordContainer />

        {/*<MonitorContainer />*/}

      </Row>

    );
  }
}
