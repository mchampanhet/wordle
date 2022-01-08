import { Component, OnInit } from '@angular/core';
import * as dictionary from './dictionary.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wordle';
  filteredWords: string[] = new Array<string>();
  index: number = 0;
  selectedWord = "";
  attempt = "";
  correction: any[][] = [[],[],[],[],[],[]];
  success = false;
  currentAttempt = 0;

  ngOnInit() {
    this.filteredWords = dictionary;
    this.index = Math.floor(Math.random() * (this.filteredWords.length - 1));
    this.selectedWord = this.filteredWords[this.index];
    console.log(this.selectedWord);
  }

  testWord(attempt: string) {
    var realChars = this.selectedWord.split("");
    var attemptChars = attempt.split("");
    attemptChars.forEach((x, index) => {
      var realChar = realChars[index];
      var validity = "";
      if (realChar == x) {
        validity = "exact";
      }
      else if (realChars.includes(x)) {
        validity = "elsewhere";
      } else {
        validity = "none";
      }

      this.correction[this.currentAttempt].push({"letter": x, "validity": validity});
    });
    
    if (this.correction[this.currentAttempt].every(x => x.validity == "exact")) {
      this.success = true;
      return;
    }
    this.attempt = "";
    this.currentAttempt++;
  }

  validityColor(validity: string) {
    return validity == 'exact' ? 'green' : validity == 'elsewhere' ? 'yellow' : 'red';
  }
}
