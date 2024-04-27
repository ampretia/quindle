import TrieSearch from 'trie-search'

import { wordlist as candidateAnswers } from './sgb-words'
import { wordlist } from './answers'

type WordKey = {
  word: string
}

export class Words {
  private trie

  private maxWords: number = wordlist.length

  constructor() {
    this.trie = new TrieSearch<WordKey>('word', {
      // splitOnRegEx: /\w/g,
    })

    candidateAnswers.forEach((w: string) => {
      this.trie.add({ word: w })
    })
  }

  check(w: string) {
    return this.trie.search(w)
  }

  random(){
    const wi = Math.floor(this.__rand(Date.now())*this.maxWords);

    return wordlist[wi];
  }

  daily(){
     const dt = new Date(Date.now());
     const date = dt.getDate();
     const month = dt.getMonth() + 1;
     const year = dt.getFullYear();

     const seed =  date+(month*100)+(year*10000);
     const wi = Math.floor(this.__rand(seed)*this.maxWords);

     return wordlist[wi];
  }

  
  __rand(a: number) {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  
}
