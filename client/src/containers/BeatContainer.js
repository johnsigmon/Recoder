import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import Tone from 'tone';
import Poti from '../components/Poti';
/*import Keyboard from '../components/Keyboard';*/
import QwertyHancock from 'qwerty-hancock';


class Oscillator extends Component {
  constructor(props) {
    super(props);
    //OSCILLATOR
    this.env = this.props.envelope;
    this.waves = ['sine','square','triangle','sawtooth'];
    this.tone = new Tone.Oscillator({
      frequency: this.props.frequency,
      type: this.waves[this.props.waveform],
      volume: this.props.volume
    }).connect(this.env).start();
    //ANIMATION
    this.dbs = new Tone.Meter();
    this.waveform = this.props.waveform;
    this.analyser = this.props.analyser;
    //USERMEDIA
    this.mic = new Tone.UserMedia({
      "volume": this.props.volume
    }).connect(this.env).connect(this.dbs).toMaster()
  }
  componentWillReceiveProps(newProps) {
    console.log(newProps.micVolume)
    //OSCILLATOR
    this.tone.detune.value = newProps.detune;
    this.tone.volume.value = newProps.volume;
    this.tone.type = this.waves[newProps.waveform];
    if (newProps.playing ) {
     this.tone.frequency.value = newProps.playing;
    }
    //ANIMATION
    console.log(this.dbs.value)
    //USERMEDIA
     let thatt = this;
     console.log(this)
     console.log(this.mic)
     this.mic.enumerateDevices().then(function(devices){
  console.log(devices)
})
    if(newProps.micOn) {
      this.mic.open('Built-in Microphone').then( ()=> {
        console.log('in the promise')
      })
    } else {
      this.mic.close();
    }

/*      console.log(this.mic.volume.value)
      this.mic.open().then(()=> {
        thatt.mic.start(10);
      })*/

    this.mic.volume.value = newProps.micVolume;
    console.log(this.mic.state)
  }

  render() {
    return (
      <div className="oscillator">
        <br/>
        { this.props.children }
      </div>
    );
  }
}

export default class BeatContainer extends Component {
  constructor(props) {
    super(props);
    //OSCILLATOR
    this.envelope = new Tone.AmplitudeEnvelope({
      attack : 0.41,
      decay : 0.21,
      sustain : 0.9,
      release : .9
    }).toMaster();

    //ANIMATION
    this.analyser = new Tone.Analyser({
      "type" : "waveform",
      "size" : 256
    });

    this.state = {
      frequencies: {
        0: 440
      },
      detunes: {
        0: 0
      },
      volumes: {
        0: -20
      },
      micVolumes: {
        0: -20
      },
      waveforms: {
        0: 1
      },
      currentNote: {

      },
      views: {
        0: 1
      }
    };
    this.setDetune = this.setDetune.bind(this);
    this.setVol = this.setVol.bind(this);
    this.setMicVol = this.setMicVol.bind(this);
    this.setWav = this.setWav.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.viewType = this.viewType.bind(this);
    this.startMic = this.startMic.bind(this);
    this.stopMic = this.stopMic.bind(this);
  }
  componentDidMount() {


    const settings = {
      id: 'keyboard',
      height: 150,
      startNote: 'C2',
      whiteNotesColour: '#fff',
      blackNotesColour: '#000',
      borderColour: '#000',
      activeColour: 'yellow',
      octaves: 2
    }
    let that = this
    this.keyboard = new QwertyHancock(settings);
    this.keyboard.keyDown = function( note, frequency) {
      /*  console.log(note + frequency)*/
        that.startNote(note, frequency)
      }
    this.keyboard.keyUp = function( note, frequency) {
    /* console.log(note + frequency)*/
     that.stopNote(note, frequency)
    }
  }

  setDetune(osc, v) {
    console.log('Detuning:' + osc + v)
    let detunes = this.state.detunes;
    detunes[osc] = v;
    this.setState({
      detunes: detunes
    });

  }
  setVol(osc, v) {
    console.log('Setting Volume')
    let volumes = this.state.volumes;
    volumes[osc] = v;
    this.setState({
      volumes: volumes
    });

  }
  setWav(osc, v) {

    let waveforms = this.state.waveforms;
    waveforms[osc] = v;

    this.setState({
      waveforms: waveforms
    });


  }
  startNote(note) {

    this.setState({playing: note});

     this.envelope.triggerAttack();

  }
  stopNote(note) {

    this.setState({playing: false});
    this.envelope.triggerRelease();
 }

  startKeyPlay(note, frequency) {
    this.setState({playing: note});
    this.envelope.triggerAttack();
  }
  stopKeyStop(note, frequency) {
    this.envelope.triggerRelease();
  }
  viewType( osc, v) {
    let views = this.state.views;
    views[osc] = v;
    this.setState({
      views: views
    });
  }
  startMic(e) {
    console.log(e)
    this.setState({micOn: true})

  /*  console.log(this.analyser)
    let canvas = document.getElementById('synthview');
    let context = canvas.getContext("2d");
    console.log(context);
        context.canvas.width = canvas.width;
        context.canvas.height = canvas.height;
        function drawLoop(){
          var canvasWidth = context.canvas.width;
          var canvasHeight = context.canvas.height;
          requestAnimationFrame(drawLoop);
          //draw the waveform
          context.clearRect(0, 0, canvasWidth, canvasHeight);
          var values = this.analyser.analyse();
          context.beginPath();
          context.lineJoin = "round";
          context.lineWidth = 6;
          context.strokeStyle = "white";
          context.moveTo(0, (values[0] / 255) * canvasHeight);
          for (var i = 1, len = values.length; i < len; i++){
            var val = values[i] / 255;
            var x = canvasWidth * (i / (len - 1));
            var y = val * canvasHeight;
            context.lineTo(x, y);
          }
          context.stroke();
        }

        drawLoop();*/
  }
  stopMic() {
    this.setState({micOn: false})
  }
  setMicVol(osc, v) {
  console.log('Setting Mic Volume')
    let micVolumes = this.state.micVolumes;
    micVolumes[osc] = v;
    this.setState({
      micVolumes: micVolumes
    });
  }

  render() {

    return (
      <Col md={12} lg={12} style={{padding:'0', margin:'0'}}>
        <Col md={6} lg={6} style={{backgroundColor: 'lightpink', height: '50%', position: 'relative', padding: '0', margin: '0'}}>
          <div className='synth'>
            <Col md={12}>

              <Oscillator frequency={440}
                detune={ this.state.detunes[0] }
                waveform={ this.state.waveforms[0] }
                volume={ this.state.volumes[0] }
                type={ 'square' }
                envelope={this.envelope}
                playing={this.state.playing}
                micOn={this.state.micOn}
                micVolume={this.state.micVolumes[0]}>
                <Col md={3}>
                  <div className="notePlaying" style={{float: 'left'}}><h3>{ this.state.playing ? this.state.playing: ''}</h3></div>
                  </Col>
                <Col md={3}>
                  <Poti className='_colored orange'
                        range={[-1200,1200]}
                        size={100}
                        label={'detune'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:-10},{label:-5},{label:'0'},{label:5},{label:10}]}
                        onChange={ this.setDetune.bind(this, 0) }
                        value={ this.state.detunes[0]} />
                </Col>
                <Col md={3}>
                  <Poti className='_colored yellow'
                        range={[0,3]}
                        size={100}
                        label={'waveform'}
                        snap={true}
                        fullAngle={300}
                        steps={[{label:'sin'},{label:'sqr'},{label:'tri'},{label:'saw'}]}
                        onChange={ this.setWav.bind(this, 0) }
                        value={ this.state.waveforms[0]} />
                </Col>
                <Col md={3}>
                  <Poti className='_colored red'
                        range={[-50,20]}
                        size={100}
                        label={'volume'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                        onChange={ this.setVol.bind(this, 0) }
                        value={ this.state.volumes[0]} />
                </Col>
                <Col md={12}>
                  <div id='keyboard'
                        onMouseDown={this.startNote.bind(this, 0)}
                        onMouseUp={this.stopNote}
                        onKeyDown={this.startNote.bind(this, 0)}
                        onKeyUp={this.stopNote}
                    />
                </Col>

              {Tone.UserMedia.supported ?
                <div>
                  <Button id="user"
                          onMouseDown={this.startMic.bind(this, 0)}
                          onMouseUp={this.stopMic}>
                          User Mic
                  </Button>
                  <Poti className='_colored red'
                    range={[-50,20]}
                    size={100}
                    label={'volume'}
                    markers={21}
                    fullAngle={300}
                    steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                    onChange={ this.setMicVol.bind(this, 0) }
                    value={ this.state.micVolumes[0]} />
              </div> :
              <div>
                <h3>No mic support</h3>
              </div>
              }
                </Oscillator>
{/*        <Button id="C4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="E4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="G4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="B4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>*/}
            </Col>
          </div>
      </Col>
      <Col md={6} lg={6} style={{backgroundColor: 'lightgreen', height: '50%', position: 'relative', padding: '0', margin: '0'}}>
        <Col md={2} lg={2}>
          <Col md={12}>
            <Poti className='_colored yellow'
              range={[0,3]}
              size={100}
              label={'View Controls'}
              snap={true}
              fullAngle={300}
              steps={[{label:'WAV'},{label:'FFT'},{label:'METER'},{label:'stuff'}]}
              onChange={ this.viewType.bind(this, 0) }
              value={ this.state.views[0]} />
          </Col>
        </Col>
        <Col md={10} lg={10}>
          <canvas id='synthview' height='315px' width='500px'></canvas>
        </Col>
      </Col>
    </Col>
    );
  }
}

