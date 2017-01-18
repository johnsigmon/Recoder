import React, { Component } from 'react'
import QwertyHancock from 'qwerty-hancock';

export default class Keyboard extends Component {
  componentDidMount () {
    const keyboard = new QwertyHancock({
           id: 'Keyboard',
           width: 600,
           height: 150,
           octaves: 2,
           startNote: 'A3',
           whiteNotesColour: 'white',
           blackNotesColour: '#1EDF3E',
           hoverColour: '#3833ED'
      });
  }
render() {

  return (
    <div id='Keyboard'></div>
    )
}

}
