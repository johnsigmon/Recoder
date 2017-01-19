import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import Poti from '../components/Poti';

export default class RecordContainer extends Component {
  render() {
    return (
      <Col md={12} style={{margin: '0', padding: '0'}}>
      <Col md={6} lg={6} style={{backgroundColor: 'lightblue', height: '315px', padding: '0', margin: '0'}}>
      </Col>
      <Col md={6} lg={6} style={{backgroundColor: 'wheat', height: '315px', padding: '0', margin: '0'}}>

      </Col>
      </Col>
    );
  }
}

