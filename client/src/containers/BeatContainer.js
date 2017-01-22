import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Tone from 'tone';
import Poti from '../components/Poti';
import Visuals from './Visuals'
/*import Keyboard from '../components/Keyboard';*/
import QwertyHancock from 'qwerty-hancock';
import Slider from 'rc-slider'

class Oscillator extends Component {
  constructor(props) {
    super(props);
    //OSCILLATOR
    this.waveform = this.props.waveform;
    this.env = this.props.envelope;
    this.rev = this.props.reverb;
    this.norm = new Tone.Normalize(-50, 20)
    this.freeverb = new Tone.Freeverb()

    this.waves = ['sine','square','triangle','sawtooth'];
    this.tone = new Tone.Oscillator({
      frequency: this.props.frequency,
      type: this.waves[this.props.waveform],
      volume: this.props.volume
    }).connect(this.env).connect(this.freeverb).start();
    //OSCILLATOR EFFECTS
/*    this.comp = this.props.comp;
    this.compressionSend = this.tone.send("compression", -Infinity);
    this.compression = new Tone.Compressor({
      threshold: this.props.threshold
    })
      .receive("compression")
      .toMaster();*/

    //ANIMATION


    //USERMEDIA
    this.mic = new Tone.UserMedia({
      "volume": this.props.volume
    }).connect(this.env).toMaster();
  }
  componentWillReceiveProps(newProps) {
    console.log(newProps)
/*    console.log('Distortion Level ' + newProps.distortion)*/
    console.log('Reverb Level ' + newProps.reverb)
/*    console.log('Mic Volume ' + newProps.micVolume)
    console.log('Synth Volume ' + newProps.volume)
    console.log('Detune Volume ' + newProps.detune)*/
    //OSCILLATOR
    this.tone.volume.value = newProps.volume;
    this.tone.detune.value = newProps.detune;
    this.tone.type = this.waves[newProps.waveform];
    if (newProps.playing ) {
    //OSCILLATOR EFFECTS
    this.tone.frequency.value = newProps.playing;
  /*  this.distortion.value = newProps.distortion;*/
 /*   this.compressionSend.gain.value = newProps.compression;*/
    this.freeverb.wet.value = newProps.reverb;
    this.freeverb.toMaster();

    }




    //USERMEDIA
     this.mic.enumerateDevices().then(function(devices){
 /* console.log(devices)*/
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



/*    this.dist = new Tone.Distortion({
      distortion: 0.8
    }).toMaster();*/

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
      reverbs: {
        0: -20
      },
      compressions: {
        0: 0
      },
      distortions: {
        0: -20
      },
      micVolumes: {
        0: -20
      },
      waveforms: {
        0: 1
      },
      currentNote: {

      }
    };
    this.setVol = this.setVol.bind(this);
    this.setWav = this.setWav.bind(this);
    this.setDetune = this.setDetune.bind(this);
    this.setReverb = this.setReverb.bind(this);
/*    this.setDistortion = this.setDistortion.bind(this);
    this.setCompression = this.setCompression.bind(this);*/
    this.setMicVol = this.setMicVol.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
    this.startMic = this.startMic.bind(this);
    this.stopMic = this.stopMic.bind(this);
  }
  componentDidMount() {
    const settings = {
      id: 'keyboard',
      height: 150,
      startNote: 'C3',
      whiteNotesColour: '#fff',
      blackNotesColour: '#000',
      borderColour: '#000',
      activeColour: 'lightblue',
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
  //OSCILLATOR
  setVol(osc, v) {
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
  setDetune(osc, v) {
    let detunes = this.state.detunes;
    detunes[osc] = v;
    this.setState({
      detunes: detunes
    });
  }
  setReverb(osc, v) {
    console.log('Setting Reverb'+ ' osc ' + osc + ' v ' + v )
    let reverbs = this.state.reverbs;
    reverbs[osc] = v;
    this.setState({
      reverbs: reverbs
    });

  }
/*  setCompression(osc, v) {
    console.log('Setting Compression' + ' osc ' + osc + ' v ' + v )
    let compressions = this.state.compressions;
    compressions[osc] = v;
    this.setState({
      compressions: compressions
    });
  }
  setDistortion(osc, v) {
    console.log('OSC: ' + osc)
    console.log('DISTORTION: ' + v)
    let distortions = this.state.distortions;
    distortions[osc] = v;
    this.setState({
      distortions: distortions
    });
    console.log(this.state.distortions)
  }*/

  startNote(note) {
    this.setState({playing: note});
    this.envelope.triggerAttack();
  }
  stopNote(note) {
    this.setState({playing: false});
    this.envelope.triggerRelease();
    this.freeverb.dispose();

  }
  startKeyPlay(note, frequency) {
    this.setState({playing: note});
    this.envelope.triggerAttack();
  }
  stopKeyStop(note, frequency) {
    this.envelope.triggerRelease();
    this.freeverb.dispose();
  }
  startMic(e) {
    this.setState({micOn: true})
  }
  stopMic() {
    this.setState({micOn: false})
  }
  setMicVol(osc, v) {
    let micVolumes = this.state.micVolumes;
    micVolumes[osc] = v;
    this.setState({
      micVolumes: micVolumes
    });
  }
  render() {

    return (
      <Col md={12} style={{padding:'0', margin:'0'}}>
      <Col md={12} lg={12} style={{padding:'0', margin:'0'}}>
        <Col md={6} lg={6} style={{backgroundColor: 'rosybrown', height: '50%', position: 'relative', padding: '0', margin: '0'}}>
          <div className='synth'>
            <Col md={12}>

              <Oscillator frequency={440}
                detune={ this.state.detunes[0] }
                waveform={ this.state.waveforms[0] }
                volume={ this.state.volumes[0] }
                distortion={ this.state.distortions[0] }
                reverb={ this.state.reverbs[0]}
                type={ 'square' }
                envelope={this.envelope}
                playing={this.state.playing}
                micOn={this.state.micOn}
                micVolume={this.state.micVolumes[0]}>
                <Col md={8} style={{backgroundColor: 'sienna', marginBottom: '20px', borderRight: '3px solid black', borderBottom: '2px solid black', borderTop: '1px solid black', borderLeft: '1px solid black'}}>
                <Col md={4}>
                  <Poti className='_synthVol'
                        range={[-50,20]}
                        size={60}
                        label={'volume'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                        onChange={ this.setVol.bind(this, 0) }
                        value={ this.state.volumes[0]} />
                </Col>
                <Col md={4}>
                  <Poti className='_detune'
                        range={[-1200,1200]}
                        size={60}
                        label={'detune'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:-10},{label:-5},{label:'0'},{label:5},{label:10}]}
                        onChange={ this.setDetune.bind(this, 0) }
                        value={ this.state.detunes[0]} />
                </Col>
                <Col md={4} style={{margin: '0 auto'}}>
                  <Poti className='_waveform'
                        range={[0,3]}
                        size={60}
                        label={'waveform'}
                        snap={true}
                        fullAngle={300}
                        steps={[{label:'sin'},{label:'sqr'},{label:'tri'},{label:'saw'}]}
                        onChange={ this.setWav.bind(this, 0) }
                        value={ this.state.waveforms[0]} />
                </Col>
                <Col md={4} style={{margin: '0 auto'}}>
                  <Poti className='_reverb'
                        range={[-50,20]}
                        size={60}
                        label={'reverb'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                        onChange={ this.setReverb.bind(this, 0) }
                        value={ this.state.reverbs[0]} />
                </Col>
                <Col md={4} style={{margin: '0 auto'}}>
                  <Poti className='_compression'
                        range={[-50,20]}
                        size={60}
                        label={'compression'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                        value={ this.state.compressions[0]} />
                </Col>
                <Col md={4} style={{margin: '0 auto'}}>
                  <Poti className='_distortion'
                        range={[-50,20]}
                        size={60}
                        label={'distortion'}
                        markers={21}
                        fullAngle={300}
                        steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                        value={ this.state.distortions[0]} />
                </Col>

              </Col>
                <Col md={3} mdOffset={1} style={{backgroundColor: 'sienna', marginBottom: '20px', borderRight: '3px solid black', borderBottom: '2px solid black', borderTop: '1px solid black', borderLeft: '1px solid black'}}>
                    {Tone.UserMedia.supported ?
                      <div>
                        <Poti className='_colored red'
                          range={[-50,20]}
                          size={100}
                          label={'volume'}
                          markers={21}
                          fullAngle={300}
                          steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                          onChange={ this.setMicVol.bind(this, 0) }
                          value={ this.state.micVolumes[0]} />
                      <Button id="user"
                          onMouseDown={this.startMic.bind(this, 0)}
                          onMouseUp={this.stopMic}
                          style={{marginBottom: '20px'}}>
                                User Mic
                    </Button>

                      </div> :
                      <div>
                        <h3>No mic support</h3>
                      </div>
                    }
                </Col>

                <Col md={12} style={{marginBottom: '30px', padding: '0'}}>
                  <div id='keyboard'
                        onMouseDown={this.startNote.bind(this, 0)}
                        onMouseUp={this.stopNote}
                        onKeyDown={this.startNote.bind(this, 0)}
                        onKeyUp={this.stopNote}
                        style={{backgroundColor: 'sienna', marginBottom: '20px', borderTop: '15px solid sienna'}}
                    />
                </Col>


                </Oscillator>
{/*        <Button id="C4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="E4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="G4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="B4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>*/}
            </Col>
          </div>
      </Col>
      <Col md={6} lg={6} style={{backgroundColor: 'lightgreen', height: '50%', position: 'relative', padding: '0', margin: '0'}}>
        <Col md={12} style={{marginBottom: '100px'}}>
          <Visuals currentNote={this.state.playing} />
        </Col>
      </Col>
    </Col>
    <Col md={12} style={{margin: '0', padding: '0'}}>
      <Col md={6} lg={6} style={{backgroundColor: 'lightblue', height: '315px', padding: '0', margin: '0'}}>
      </Col>
      <Col md={6} lg={6} style={{backgroundColor: 'wheat', height: '315px', padding: '0', margin: '0'}}>


      </Col>
    </Col>
  </Col>
   );
  }
}

