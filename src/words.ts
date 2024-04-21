import TrieSearch from 'trie-search'
import chalk from 'chalk'
import { wordlist } from './sgb-words'
type WordKey = {
  word: string
}

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
        this.letterGuess[i - 1] = { letter: '?', answer: LetterResult.UNSET }
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
    console.log(w)
    const r = words.check(w)
    console.log(r)
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

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

export class Game {
  answer: string[]
  guesses: Guess[] = []
  max_guesses: number = 6
  allCorrect: boolean = false
  currentGuess = 0
  words: Words

  stateMsg: string = ''

  constructor(words: Words) {
    this.words = words
    this.answer = this.words.random().word.toUpperCase().split('')
    console.log(this.answer)
    for (let x = 0; x < this.max_guesses; x++) {
      this.guesses.push(new Guess())
    }
  }

  add_letter(l: string) {
    this.guesses[this.currentGuess].addLetterGuess(l)
  }

  remove_letter() {
    this.guesses[this.currentGuess].removeLastGuess()
  }

  checkGuess() {
    let result
    const cg = this.guesses[this.currentGuess]

    if (cg.fullyGuessed()) {
      const realWord = cg.realWord(this.words)
      if (realWord) {
        result = cg.check(this.answer)
        if (result) this.currentGuess++
      } else {
        this.stateMsg = 'not a word'
      }
    } else {
      this.stateMsg = 'Type more'
    }

    if (this.currentGuess === this.max_guesses) {
      this.stateMsg = this.answer.join('')
      return
    }

    return result
  }

  msg() {
    return { guessnum: `${this.currentGuess + 1}`, stateMsg: this.stateMsg }
  }
}

export class Words {
  private trie

  constructor() {
    this.trie = new TrieSearch<WordKey>('word', {
      // splitOnRegEx: /\w/g,
    })

    wordlist.forEach((w: string) => {
      this.trie.add({ word: w })
    })
  }

  check(w: string) {
    return this.trie.search(w)
  }

  random() {
    const item = letters[Math.floor(Math.random() * letters.length)]

    const words = this.trie.search(item)
    return words[Math.floor(Math.random() * Words.length)]
  }
}
