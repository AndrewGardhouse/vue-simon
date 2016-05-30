<template>
  <div id="app">
    <div class="board" v-bind:class="{ 'active': gameOn }">
      <game-button id="1" class="button green" v-on:click="playerMove(0)" :disabled="!gameOn"></game-button>
      <game-button id="2" class="button red" v-on:click="playerMove(1)" :disabled="!gameOn"></game-button>
      <game-button id="3" class="button blue" v-on:click="playerMove(2)" :disabled="!gameOn"></game-button>
      <game-button id="4" class="button yellow" v-on:click="playerMove(3)" :disabled="!gameOn"></game-button>
      <div class="options">
        <div class="title">
          <h1>simon</h1>
          <p v-cloak>Round: {{ round }}</p>
          <button v-on:click="startGame()" class="start-game" v-bind:class="{ 'active': gameOn }" :disabled="gameOn"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appCredentials from '../firebase-credentials'
import firebase from 'firebase'
import GameButton from './Button.vue'

firebase.initializeApp(appCredentials)

let dataBase = firebase.database()

export default {
  components: {
    GameButton
  },
  data () {
    return {
      sequence: [],
      evaluationSequence: [],
      round: 0,
      gameOn: false,
      highScores: ''
    }
  },
  methods: {
    addHighScore () {
      dataBase.ref('/scores').push().set({
        score: this.round
      })
    },
    addToSequence () {
      let move = (Math.round(Math.random() * 3) + 1) - 1
      this.round += 1
      this.sequence.push(move)
      this.evaluationSequence = this.sequence.slice(0)
    },
    runSequence () {
      let i = 0
      for (let number of this.sequence) {
        i++
        setTimeout(() => {
          this.$children[number].lightUp()
          setTimeout(() => {
            this.$children[number].turnOffLight()
          }, 500)
        }, 1000 * i)
      }
    },
    computerTurn () {
      this.addToSequence()
      this.runSequence()
    },
    startGame () {
      this.gameOn = true
      this.computerTurn()
    },
    playerMove (move) {
      if (move == this.evaluationSequence.shift()) {
        if (this.evaluationSequence.length == 0 && this.gameOn) {
          this.computerTurn()
        }
      } else {
        this.addHighScore()
        let gameOver = true
        for (let button of this.$children) {
          button.lightUp(gameOver)
          setTimeout(() => {
            button.turnOffLight()
          }, 700)
        }
        this.round = 0
        this.sequence = []
        this.evaluationSequence = []
        this.gameOn = false
      }
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  height: 100%;
}

body {
  font-family: 'Sarpanch', Helvetica, sans-serif;
  background-image: -webkit-gradient(
  	linear,
  	left top,
  	right bottom,
  	color-stop(0, #37D397),
  	color-stop(0.46, #6890F4),
  	color-stop(0.9, #F2BCE0)
  );
  background-image: -o-linear-gradient(right bottom, #37D397 0%, #6890F4 46%, #F2BCE0 90%);
  background-image: -moz-linear-gradient(right bottom, #37D397 0%, #6890F4 46%, #F2BCE0 90%);
  background-image: -webkit-linear-gradient(right bottom, #37D397 0%, #6890F4 46%, #F2BCE0 90%);
  background-image: -ms-linear-gradient(right bottom, #37D397 0%, #6890F4 46%, #F2BCE0 90%);
  background-image: linear-gradient(to right bottom, #37D397 0%, #6890F4 46%, #F2BCE0 90%);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  position: relative;
}

p {
  margin: 0;
}

button {
  outline: none;
  border: none;
}

.board {
  position: absolute;
  background-color: black;
  height: 95vh;
  width: 95vh;
  border-radius: 50%;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  box-shadow: 0px 0px 12px #222;
}

.start-game {
  width: 50px;
  height: 50px;
  margin: auto;
  margin-top: 7%;
  border-radius: 50%;
  background-color: green;
  cursor: pointer;
}

.start-game.active {
  background-color: #00e600;
  cursor: default;
}
.board {
  position: absolute;
  background-color: black;
  height: 95vh;
  width: 95vh;
  border-radius: 50%;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  box-shadow: 0px 0px 12px #222;
}

.start-game {
  width: 10vh;
  height: 10vh;
  margin: auto;
  margin-top: 2%;
  border-radius: 50%;
  background-color: green;
  cursor: pointer;
}

.start-game.active {
  background-color: #00e600;
  cursor: default;
}

.options {
  position: absolute;
  border-radius: 50%;
  height: 35%;
  width: 35%;
  left: 32.5%;
  top: 32.5%;
  background-color: black;
}

.title {
  text-align: center;
  position: relative;
  font-size: 1.5em;
  top: 0;
  color: #c0c0c0;
}

.title > h1 {
  margin-bottom: 0;
  font-size: 9vh;
  margin-top: 18%;
  line-height: 1em;
}

.title > p {
  margin: 0;
  font-size: 4vh;
}

@media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
  .board {
    width: 95vw;
    height: 95vw;
  }
  .start-game {
    width: 10vw !important;
    height: 10vw !important;
    margin-top: 0;
  }
  .title > h1 {
    font-size: 1em !important;
  }
  .title > p {
    font-size: 0.5em !important;
  }
}

@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) {
  .board {
    width: 90vw;
    height: 90vw;
  }

  .title > h1 {
    font-size: 6vh;
    margin-top: 13%;
  }

  .title > p {
    margin: 0;
    font-size: 3vh;
  }

  .start-game {
    width: 8vh;
    height: 8vh;
  }
}

</style>
