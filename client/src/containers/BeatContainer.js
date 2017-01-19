import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Tone from 'tone';
import Poti from '../components/Poti';
import Keyboard from '../components/Keyboard';
import QwertyHancock from 'qwerty-hancock';


class Oscillator extends Component {
  constructor(props) {
    super(props);

    this.env = this.props.envelope;
   this.waves = ['sine','square','triangle','sawtooth'];

    this.tone = new Tone.Oscillator({
      frequency: this.props.frequency,
      type: this.waves[this.props.waveform],
      volume: this.props.volume
    }).connect(this.env).start();

  }
  componentWillReceiveProps(newProps) {
    console.log('Oscillator WillReceiveProps')
    this.tone.detune.value = newProps.detune;
    this.tone.volume.value = newProps.volume;
    this.tone.type = this.waves[newProps.waveform];
    if (newProps.playing ) {
     this.tone.frequency.value = newProps.playing;
    }
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
    this.envelope = new Tone.AmplitudeEnvelope({
      attack : 0.41,
      decay : 0.21,
      sustain : 0.9,
      release : .9
    }).toMaster()
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
      waveforms: {
        0: 1
      },
      currentNote: {

      }
    };
    this.setFrequency = this.setFrequency.bind(this);
    this.setDetune = this.setDetune.bind(this);
    this.setVol = this.setVol.bind(this);
    this.setWav = this.setWav.bind(this);
    this.startNote = this.startNote.bind(this);
    this.stopNote = this.stopNote.bind(this);

  }
  componentDidMount() {
    const settings = {
      id: 'keyboard',
      width: 600,
      height: 150,
      startNote: 'A2',
      whiteNotesColour: '#fff',
      blackNotesColour: '#000',
      borderColour: '#000',
      activeColour: 'yellow',
      octaves: 3
    }
    let that = this
    this.keyboard = new QwertyHancock(settings);
    this.keyboard.keyDown = function( note, frequency) {
        console.log(note + frequency)
        that.startNote(note, frequency)
      }
    this.keyboard.keyUp = function( note, frequency) {
     console.log(note + frequency)
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
    setFrequency(note, frequency) {


    console.log(frequency);
    let frequencies = this.state.frequencies
    frequencies[note] = frequencies;
    this.setState({
      frequencies: frequencies
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
    this.envelope.triggerAttack();
  }
  stopKeyStop(note, frequency) {
    this.envelope.triggerRelease();
  }
  render() {

    return (
      <div className='synth'>
     <Oscillator frequency={440}
                  detune={ this.state.detunes[0] }
                  waveform={ this.state.waveforms[0] }
                  volume={ this.state.volumes[0] }
                  type={ 'square' }
                  envelope={this.envelope}
                  playing={this.state.playing}>
          <Poti className='_colored orange'
                range={[-50,50]}
                size={60}
                label={'detune'}
                markers={21}
                fullAngle={300}
                steps={[{label:-10},{label:-5},{label:'0'},{label:5},{label:10}]}
                onChange={ this.setDetune.bind(this, 0) }
                value={ this.state.detunes[0]} />
          <Poti className='_colored yellow'
                range={[0,3]}
                size={60}
                label={'waveform'}
                snap={true}
                fullAngle={300}
                steps={[{label:'sin'},{label:'sqr'},{label:'tri'},{label:'saw'}]}
                onChange={ this.setWav.bind(this, 0) }
                value={ this.state.waveforms[0]} />
          <Poti className='_colored red'
                range={[-50,20]}
                size={60}
                label={'volume'}
                markers={21}
                fullAngle={300}
                steps={[{label:'min'},{},{},{},{},{},{},{},{},{},{label:'max'}]}
                onChange={ this.setVol.bind(this, 0) }
                value={ this.state.volumes[0]} />
          <div id='keyboard'
                onMouseDown={this.setFrequency.bind(this) && this.startNote.bind(this, 0)}
                onMouseUp={this.setFrequency.bind(this) && this.stopNote}
                onKeyDown={this.setFrequency.bind(this) && this.startNote.bind(this, 0)}
                onKeyUp={this.setFrequency.bind(this) && this.stopNote}
            />
        </Oscillator>
        <Button id="C4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="E4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="G4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>
        <Button id="B4" onMouseDown={this.startNote} onMouseUp={this.stopNote}>C4</Button>

      </div>);
  }
}

