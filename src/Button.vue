<template>
  <button v-bind:class="{ 'active': isLitUp }" v-on:mousedown.stop="lightUp()" v-on:mouseup.stop="turnOffLight()"></button>
</template>

<script>
import Tone from 'tone'
export default {
  props: {
    colour: String,
    id: String
  },
  data () {
    return {
      isLitUp: false,
      identifier: '',
      buttonSound: ''
    }
  },
  compiled () {
    this.identifier = Number(this.id)
    this.createSound()
  },
  methods: {
    createSound () {
      this.buttonSound = new Tone.SimpleSynth().toMaster();
    },
    lightUp (gameOver = false) {
      let note = ''
      if (gameOver) {
        note = 'E0'
      } else {
        switch (this.identifier) {
          case 1:
            note = 'G3'
            break
          case 2:
            note = 'E4'
            break
          case 3:
            note = 'G4'
            break
          case 4:
            note = 'C4'
            break
        }
      }

      if (!this.isLitUp) {
        this.isLitUp = true
        this.buttonSound.triggerAttack(note)
      }
    },
    turnOffLight () {
      if (this.isLitUp) {
        this.isLitUp = false
        this.buttonSound.triggerRelease()
      }
    }
  }
}
</script>

<style>
.button {
  position: absolute;
  height: 44%;
  width: 44%;
}

.board.active > .button {
  cursor: pointer;
}

.button.green {
  background-color: green;
  border-top-left-radius: 100%;
  top: 5%;
  left: 5%;
}

.button.green.active {
  background-color: #00e600;
}

.button.red {
  background-color: #990000;
  border-top-right-radius: 100%;
  right: 5%;
  top: 5%;
}

.button.red.active {
  background-color: red;
}

.button.yellow {
  background-color: #b3b300;
  border-bottom-left-radius: 100%;
  left: 5%;
  bottom: 5%;
}

.button.yellow.active {
  background-color: yellow;
}

.button.blue {
  background-color: #0000cc;
  border-bottom-right-radius: 100%;
  right: 5%;
  bottom: 5%;
}

.button.blue.active {
  background-color: #3333ff;
}
</style>
