import TrieSearch from 'trie-search'
import chalk from 'chalk'
import { wordlist as candidateAnswers } from './sgb-words'
import { wordlist } from './answers'
import type { Words } from './words'



export enum GameMode {DAILY,RANDOM}

export enum LetterResult {
  WRONG,
  CORRECT,
  WRONG_PLACE,
  SET,
  UNSET
}

export class LetterGuess {
  letter: string
  answer: LetterResult

  constructor(letter: string) {
    this.letter = letter
    this.answer = LetterResult.UNSET
  }
}

export class Guess {
  letterGuess: LetterGuess[] = []

  allCorrect: boolean = false

  constructor() {
    for (let x = 0; x < 5; x++) {
      this.letterGuess.push({ letter: ' ', answer: LetterResult.UNSET })
    }
  }

  isCorrect() {
    return this.allCorrect
  }

  removeLastGuess() {
    for (let i = this.letterGuess.length; i > 0; i--) {
      if (this.letterGuess[i - 1].answer === LetterResult.SET) {
        this.letterGuess[i - 1] = { letter: '', answer: LetterResult.UNSET }
        break
      }
    }
  }

  addLetterGuess(lg: string) {
    const next = this.letterGuess.map((e) => e.answer).indexOf(LetterResult.UNSET)
    if (next > -1) {
      this.letterGuess[next] = { letter: lg, answer: LetterResult.SET }
    }
  }

  fullyGuessed() {
    return this.letterGuess.reduce((result, value) => {
      if (!result) {
        return false
      }
      if (value.answer === LetterResult.UNSET) {
        return false
      }

      return true
    }, true)
  }

  realWord(words: Words) {
    const w = this.letterGuess.map((e) => e.letter).join('')
    const r = words.check(w)
    return r.length > 0
  }

  check(answer: string[]) {
    const tempAnswer = [...answer]
    const lettersPicked: { [key: string]: LetterResult } = {}

    for (let i = 0; i < this.letterGuess.length; i++) {
      const l = this.letterGuess[i].letter
      if (l === tempAnswer[i]) {
        this.allCorrect = true
        this.letterGuess[i].answer = LetterResult.CORRECT
        lettersPicked[l] = LetterResult.CORRECT
        tempAnswer[i] = '_'
      } else if (tempAnswer.includes(l)) {
        this.allCorrect = false
        this.letterGuess[i].answer = LetterResult.WRONG_PLACE
        lettersPicked[l] = LetterResult.WRONG_PLACE
      } else {
        this.allCorrect = false
        this.letterGuess[i].answer = LetterResult.WRONG
        lettersPicked[l] = LetterResult.WRONG
      }
    }
    lettersPicked['allCorrect'] = this.allCorrect?LetterResult.CORRECT : LetterResult.WRONG;
    return lettersPicked
  }

  toString() {
    let s = ''
    this.letterGuess.forEach((lg) => {
      if (lg.answer === LetterResult.CORRECT) {
        s = s.concat(`${chalk.green(lg.letter)}`)
        this.allCorrect = true
      } else if (lg.answer === LetterResult.WRONG_PLACE) {
        s = s.concat(`${chalk.yellow(lg.letter)}`)
        this.allCorrect = false
      } else {
        s = s.concat(`${lg.letter}`)
        this.allCorrect = false
      }
    })

    return s
  }
}

// const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

export class Game {
  dailyanswer: string[] = []
  randomanswer: string[] = []
  guesses: Guess[] = []
  max_guesses: number = 2
  allCorrect: boolean = false
  currentGuess = 0
  words: Words

  mode: GameMode = GameMode.DAILY;

  stateMsg: string = ''

  constructor(words: Words) {
    this.words = words

  }

  setup(mode: GameMode){
    this.dailyanswer = this.words.daily().toUpperCase().split('')
    this.randomanswer = this.words.random().toUpperCase().split('')
    console.log(`Daily = ${this.dailyanswer}  Random = ${this.randomanswer}`)
    this.guesses = []
    for (let x = 0; x < this.max_guesses; x++) {
      this.guesses.push(new Guess())
    }
    this.mode = mode;
    this.currentGuess = 0;
    this.allCorrect = false;
    this.stateMsg = '';
  }

  add_letter(l: string) {
    this.resetMsg();
    this.guesses[this.currentGuess].addLetterGuess(l)
  }

  remove_letter() {
    this.resetMsg();
    this.guesses[this.currentGuess].removeLastGuess()
  }

  checkGuess(){
    if (this.mode==GameMode.DAILY){
      return this._checkGuess(this.dailyanswer);
    } else {
      return this._checkGuess(this.randomanswer)
    }
    
  }

  _checkGuess(answer: string[]) {
    let result
    const cg = this.guesses[this.currentGuess]

    if (cg.fullyGuessed()) {
      const realWord = cg.realWord(this.words)
      if (realWord) {
        result = cg.check(answer)
        if (result['allCorrect']===LetterResult.CORRECT){
          this.stateMsg="Well done!!"
        }
        if (result) this.currentGuess++
      } else {
        this.stateMsg = 'mmm.. not a word'
      }
    } else {
      this.stateMsg = 'need a few more...'
    }

    if (this.currentGuess === this.max_guesses) {
      this.stateMsg = answer.join('')
      return
    }

    return result
  }

  msg() {
    return { guessnum: `${this.currentGuess + 1}`, stateMsg: this.stateMsg }
  }

  resetMsg(){
    this.stateMsg='';
  }
}
