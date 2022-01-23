import { Component, HostListener, OnInit } from '@angular/core';
import * as dictionary from './dictionary.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.onKeyUp(event.key);
  }
  title = 'wordle';
  dictionary: string[] = new Array<string>();
  index: number = 0;
  selectedWord = "";
  attempts: attemptLetter[][] = [
    [new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter],
    [new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter],
    [new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter],
    [new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter],
    [new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter],
    [new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter, new attemptLetter]
  ];
  // correction: any[][] = [[],[],[],[],[],[]];
  success = false;
  currentAttempt = 0;
  currentLetter = 0;
  isInvalidAttempt = false;
  keys = [
    [ 
      new attemptLetter("Q",0),
      new attemptLetter("W",0),
      new attemptLetter("E",0),
      new attemptLetter("R",0),
      new attemptLetter("T",0),
      new attemptLetter("Y",0),
      new attemptLetter("U",0),
      new attemptLetter("I",0),
      new attemptLetter("O",0),
      new attemptLetter("P",0)
    ],
    [ 
      new attemptLetter("A",0),
      new attemptLetter("S",0),
      new attemptLetter("D",0),
      new attemptLetter("F",0),
      new attemptLetter("G",0),
      new attemptLetter("H",0),
      new attemptLetter("J",0),
      new attemptLetter("K",0),
      new attemptLetter("L",0)
    ],
    [ 
      new attemptLetter("Enter",0),
      new attemptLetter("Z",0),
      new attemptLetter("X",0),
      new attemptLetter("C",0),
      new attemptLetter("V",0),
      new attemptLetter("B",0),
      new attemptLetter("N",0),
      new attemptLetter("M",0),
      new attemptLetter("Backspace",0)
    ]
  ];
  keyMap: keyMapItem[] = [
    new keyMapItem("Q", 0,0),
    new keyMapItem("W", 0,1),
    new keyMapItem("E", 0,2),
    new keyMapItem("R", 0,3),
    new keyMapItem("T", 0,4),
    new keyMapItem("Y", 0,5),
    new keyMapItem("U", 0,6),
    new keyMapItem("I", 0,7),
    new keyMapItem("O", 0,8),
    new keyMapItem("P", 0,9),
    new keyMapItem("A", 1,0),
    new keyMapItem("S", 1,1),
    new keyMapItem("D", 1,2),
    new keyMapItem("F", 1,3),
    new keyMapItem("G", 1,4),
    new keyMapItem("H", 1,5),
    new keyMapItem("J", 1,6),
    new keyMapItem("K", 1,7),
    new keyMapItem("L", 1,8),
    new keyMapItem("Z", 2,1),
    new keyMapItem("X", 2,2),
    new keyMapItem("C", 2,3),
    new keyMapItem("V", 2,4),
    new keyMapItem("B", 2,5),
    new keyMapItem("N", 2,6),
    new keyMapItem("M", 2,7),
  ];

  get showModal() {
    return this.success || this.currentAttempt == 6;
  }

  ngOnInit() {
    // this.dictionary = this.dictionary.map(x => x.toUpperCase());
    this.dictionary = Array.from(dictionary).map(x => x.toUpperCase());
    this.index = Math.floor(Math.random() * (this.dictionary.length - 1));
    this.selectedWord = this.dictionary[this.index];
    console.log(this.selectedWord);
  }

  onKeyUp(key: string) {
    console.log(key);
    const regex = /^[A-Z]|[a-z]$/;
    if (regex.test(key) && key.length == 1 && (this.currentLetter < 4 || this.attempts[this.currentAttempt][4].letter == '?')) {
    // if (key.toUpperCase() >= "A" && key.toUpperCase() <= "Z" && (this.currentLetter < 4 || this.attempts[this.currentAttempt][4].letter == '?')) {
      this.attempts[this.currentAttempt][this.currentLetter].letter = key.toUpperCase();
      if (this.currentLetter < 5) {
        this.currentLetter++;
      }
    } else if (key == 'Backspace' && this.currentLetter > 0) {
      const letterToErase = this.currentLetter == 4 ? 4 : this.currentLetter - 1;
      this.attempts[this.currentAttempt][this.currentLetter - 1].letter = "?";
      this.isInvalidAttempt = false;
      this.currentLetter--;
    } else if (key == 'Enter') {
      this.testWord(this.attempts[this.currentAttempt]);
    }
  }

  testWord(attempt: attemptLetter[]) {
    console.log('start');
    var attemptString = attempt.map(x => x.letter).join('');
    console.log(attemptString);
    if (!this.dictionary.includes(attemptString)) {
      this.isInvalidAttempt = true;
      return;
    }

    this.isInvalidAttempt = false;
    var realChars = this.selectedWord.toUpperCase().split("");
    var attemptChars = attemptString.toUpperCase().split("");
    attemptChars.forEach((x, index) => {
      var realChar = realChars[index];
      var validity = 1;
      if (realChar == x) {
        validity = 2;
      }
      else if (!realChars.includes(x)) {
        validity = -1;
      }

      this.attempts[this.currentAttempt][index].letter = x; 
      this.attempts[this.currentAttempt][index].validity = validity;
    });
    
    if (this.attempts[this.currentAttempt].every(x => x.validity == 2)) {
      this.success = true;
      return;
    }

    this.attempts[this.currentAttempt].forEach(letter => {
      const keyMap = this.keyMap.find(x => x.letter == letter.letter);
      if (!keyMap) {
        return;
      }

      const key = this.keys[keyMap.row][keyMap.index];
      key.validity = this.getKeyValidity(letter.validity, key.validity);
    });

    this.currentAttempt++;
    this.currentLetter = 0;
  }

  getKeyValidity(letter: number, key: number) {
    if (letter == -1) return -1;
    if (letter > key) return letter;
    return key;
  }

  validityColor(validity: number) {
    return validity == 2 ? 'bg-success' : validity == 1 ? 'bg-warning' : validity == -1 ? 'bg-secondary' : 'bg-light';
  }

  refresh() {
    window.location.reload();
  }

  emitKeyEvent(letter: string) {
    const event = new KeyboardEvent("keyup",{
      "key": letter
    });
    document.getRootNode().dispatchEvent(event);
  
  }
}

class entry {
  word: string = "";
  points: number = 0;
  wildcards: string[] = new Array<string>();
}

class attemptLetter {
  letter: string;
  validity: number;

  constructor(letter: string = "?", validity: number = 0) {
    this.letter = letter;
    this.validity = validity;
  }
}

class keyMapItem {
  letter: string;
  row: number;
  index: number;

  constructor(letter: string, row: number, index: number) {
    this.letter = letter;
    this.row = row;
    this.index = index;
  }
}