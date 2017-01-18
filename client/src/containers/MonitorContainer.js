import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

export default class MonitorContainer extends Component {
  render() {
    return (
      <Col md={6} lg={6} style={{backgroundColor: 'lightgreen', height: '50%', position: 'relative', padding: '0', margin: '0'}}>
     Monitor
      </Col>
    );
  }
}
