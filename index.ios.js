/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, StyleSheet, Text, View, Image, AppRegistry} from 'react-native';
import SwipeCards from 'react-native-swipe-cards';
const audio = require('react-native').NativeModules.RNAudioPlayerURL;
import _ from 'lodash';
import s from 'string';
import Promise from 'bluebird';
import connect from './connect';

class Card extends Component {

  componentDidMount() {
    audio.initWithURL(`http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=${this.props.text}&tl=En-gb`);
    audio.play();
  }

  render() {
    let pronounciation = this.props.pronounciation && this.props.pronounciation[0];
    pronounciation = pronounciation && pronounciation.raw;
    const pronounciationView = pronounciation ? (
      <Text style={styles.pronounciation}>{pronounciation}</Text>
    ) : null;

    const definitions = this.props.definition ? this.props.definition.map(data => {
      return (
        <Text style={styles.content}>{data.text}</Text>
      )
    }) : null;


    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.header}>{s(this.props.text).capitalize().s}</Text>
          {pronounciationView}
          {definitions}
        </View>
      </View>
    )
  }
}

const pronounciation = (word) => {
  return `http://api.wordnik.com:80/v4/word.json/${word}/pronunciations?useCanonical=false&typeFormat=ahd&limit=50&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
}

const definition = (word) => {
  return `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`
}

class LearnWords extends Component {
  constructor() {
    super();
    this.state = {
      cards: []
    }
  }

  componentDidMount() {

    fetch('http://www.mocky.io/v2/57418298120000fb1ea581af')
    .then((response) => response.text())
    .then(res => {
      return JSON.parse(res)
    })
    .then(data => {
      return data.words;
    })
    .then(words => {
      return _.map(words, word => {
        return {
          text: word
        }
      })
    })
    .then(cards => {
      console.log(cards);
      this.setState({
        cards: cards
      })
    })
  }

  handleYup (card) {
    console.log(`Yup for ${card.text}`)
  }

  handleNope (card) {
    console.log(`Nope for ${card.text}`)
  }
  render() {

    if (this.state.cards.length === 0) {
      return null;
    }

    return (
      <SwipeCards
        cards={this.state.cards}
        renderCard={(cardData) => {
          return connect(() => {
            console.log(pronounciation(cardData.text));
            return {
              pronounciation: (() => {
                return new Promise((resolve, reject) => {
                  fetch(pronounciation(cardData.text))
                  .then(res => res.text())
                  .then(res => JSON.parse(res))
                  .then(resolve)
                  .catch(reject)
                })
              })(),
              definition: (() => {
                return new Promise((resolve, reject) => {
                  fetch(definition(cardData.text))
                  .then(res => res.text())
                  .then(res => JSON.parse(res))
                  .then(resolve)
                  .catch(reject)
                })
              })()
            }
          }, cardData)(Card)
        }}
        renderNoMoreCards={() => null}
        loop={true}
        handleYup={this.handleYup.bind(this)}
        handleNope={this.handleNope.bind(this)}
        />
    )
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 300,
    height: 250,
    backgroundColor: "#FFF",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOpacity: .3,
    shadowOffset: {width:0, height:2},
    shadowRadius: 2,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: "hidden"
  },
  header: {
    fontSize: 30
  },
  pronounciation: {
    fontSize: 18
  },
  content: {
    fontSize: 14,
    color: "#333"
  }
})

AppRegistry.registerComponent('LearnWords', () => LearnWords);

