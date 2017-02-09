import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';


export default class RecordContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecordingOn: false,
    }
/*    this.mediaRecorder = new MediaRecorder();*/
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    this.setState(prevState => ({
      isRecordingOn: !prevState.isRecordingOn
    }));
   /* this.state.isRecordingOn ?  this.setState({ isRecordingOn: false}) : this.setState({ isRecordingOn: true})*/
    console.log(this.state)
  }
  render() {
    navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
    const record = document.querySelector('.record');
    const soundClips = document.querySelector('.soundClips');
    return (
      <Col md={12} style={{margin: '0', padding: '0'}}>

        <Button className='record' onClick={this.handleClick}>
          {this.state.isRecordingOn ? 'STOP' : 'RECORD'}
          </Button>
        <article className='soundClips'></article>
        <canvas className='visualizer'></canvas>
        <canvas className='myTrackCanvas'></canvas>


      </Col>
    );
  }
}

