import { AfterViewChecked, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedCipher: string | null = null;
  plain: string ='';
  key: string  = "";
  op : string = "";
  result: string = "";
  cipherInstructions: string = '';


  selectCipher(cipher: string) {
    this.selectedCipher = cipher;
  }


infrastructure(text: string) {

  switch (text) {
    case 'caesar cipher':
      this.cipherInstructions = 'For Caesar Cipher: Enter the plain text and provide a numeric key for shifting (e.g., 3).';
      break;
    case 'monoalphabitic cipher':
      this.cipherInstructions = 'For Monoalphabetic Cipher: Enter the plain text and a key, which is a scrambled alphabet (e.g., ZEBRAS).';
      break;
    case 'playfair cipher':
      this.cipherInstructions = 'For Playfair Cipher: Enter the plain text and a keyword (e.g., KEYWORD) for generating the matrix.';
      break;
    case 'hill cipher':
      this.cipherInstructions = 'For Hill Cipher: Enter the plain text and a key, which is a square matrix of letters (e.g., "GYBNQKURP").';
      break;
    case 'polyalphabitic cipher':
      this.cipherInstructions = 'For Polyalphabetic Cipher: Enter the plain text and a key, which can be a word (e.g., VIGENERE).';
      break;
    case 'one time pad':
      this.cipherInstructions = 'For One Time Pad: Enter the plain text and a random key of the same length (e.g., "XMCKL").';
      break;
    default:
      this.cipherInstructions = '';
  }
}









  encrypt(): void {
    if (this.op == "enc") {
      if (this.selectedCipher == null) {
        this.result = "choose your algorithm";
      } else if (this.selectedCipher == "caesar cipher") {
        this.result = this.caesarCipher(this.plain, parseInt(this.key), true);
      } else if (this.selectedCipher == "monoalphabitic cipher") {
        this.result = this.monoalphabeticCipher(this.plain, this.key, true);
      } else if (this.selectedCipher == "playfair cipher") {
        this.result = this.playfairCipher(this.plain, this.key, true);
      } else if (this.selectedCipher == "hill cipher") {
        this.result = this.hillCipher(this.plain, this.key, true);
      } else if (this.selectedCipher == "polyalphabitic cipher") {
        this.result = this.polyalphabeticCipher(this.plain, this.key, true);
      } else if (this.selectedCipher == "one time pad") {
        this.result = this.oneTimePad(this.plain, this.key, true);
      }

    } else if (this.op == "dec") {
      if (this.selectedCipher == null) {
        this.result = "choose your algorithm";
      } else if (this.selectedCipher == "caesar cipher") {
        this.result = this.caesarCipher(this.plain, parseInt(this.key), false);
      } else if (this.selectedCipher == "monoalphabitic cipher") {
        this.result = this.monoalphabeticCipher(this.plain, this.key, false);
      } else if (this.selectedCipher == "playfair cipher") {
        this.result = this.playfairCipher(this.plain, this.key, false);
      } else if (this.selectedCipher == "hill cipher") {
        this.result = this.hillCipher(this.plain, this.key, false);
      } else if (this.selectedCipher == "polyalphabitic cipher") {
        this.result = this.polyalphabeticCipher(this.plain, this.key, false);
      } else if (this.selectedCipher == "one time pad") {
        this.result = this.oneTimePad(this.plain, this.key, false);
      }
    } else {
      this.result = "choose the operation";
    }
  }

  selectoperation(operation: string) {
    this.op = operation;
  }

  // Caesar Cipher
  caesarCipher(text: string, key: number, encrypt: boolean): string {
    const shift = encrypt ? key : -key;
    return text.replace(/[a-z]/gi, (char) => {
      const offset = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - offset + shift + 26) % 26) + offset);
    });
  }

  // Monoalphabetic Cipher
  monoalphabeticCipher(text: string, key: string, encrypt: boolean): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const keyMap = encrypt ? key : alphabet;
    const refMap = encrypt ? alphabet : key;
    return text.replace(/[a-z]/gi, (char) => {
      const index = refMap.indexOf(char.toLowerCase());
      const replacement = index !== -1 ? keyMap[index] : char;
      return char === char.toUpperCase() ? replacement.toUpperCase() : replacement;
    });
  }

  // Playfair Cipher
   // Playfair Cipher
   playfairCipher(text: string, key: string, encrypt: boolean): string {
    const matrix = this.generatePlayfairMatrix(key);
    const pairs = this.createPlayfairPairs(text);
    return this.processPlayfairPairs(pairs, matrix, encrypt);
  }

  generatePlayfairMatrix(key: string): string[][] {
    const alphabet = 'abcdefghiklmnopqrstuvwxyz';
    const matrix: string[][] = [];
    let keyText = (key + alphabet).replace(/j/g, 'i');
    keyText = Array.from(new Set(keyText)).join('');

    for (let i = 0; i < 5; i++) {
      matrix.push(keyText.slice(i * 5, i * 5 + 5).split(''));
    }
    return matrix;
  }

  createPlayfairPairs(text: string): string[] {
    text = text.replace(/j/g, 'i');
    const pairs: string[] = [];
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length && text[i] === text[i + 1]) {
        pairs.push(text[i] + 'x');
        i--;
      } else {
        pairs.push(text[i] + (text[i + 1] || 'x'));
      }
    }
    return pairs;
  }

  processPlayfairPairs(pairs: string[], matrix: string[][], encrypt: boolean): string {
    let result = '';
    const shift = encrypt ? 1 : -1;

    pairs.forEach(pair => {
      let [row1, col1] = this.findPosition(matrix, pair[0]);
      let [row2, col2] = this.findPosition(matrix, pair[1]);

      if (row1 === row2) {
        result += matrix[row1][(col1 + shift + 5) % 5];
        result += matrix[row2][(col2 + shift + 5) % 5];
      } else if (col1 === col2) {
        result += matrix[(row1 + shift + 5) % 5][col1];
        result += matrix[(row2 + shift + 5) % 5][col2];
      } else {
        result += matrix[row1][col2];
        result += matrix[row2][col1];
      }
    });

    return result;
  }

  findPosition(matrix: string[][], char: string): [number, number] {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (matrix[row][col] === char) {
          return [row, col];
        }
      }
    }
    return [-1, -1];
  }

  // Hill Cipher
  // Hill Cipher
  hillCipher(text: string, key: string, encrypt: boolean): string {
    const keyMatrix = this.parseKeyMatrix(key);
    const textVector = this.createTextVector(text);

    if (!keyMatrix || !textVector) {
      return 'Invalid input';
    }

    const resultVector = this.multiplyMatrixVector(keyMatrix, textVector, encrypt);
    return this.vectorToText(resultVector);
  }

  parseKeyMatrix(key: string): number[][] | null {
    const size = Math.sqrt(key.length);
    if (size % 1 !== 0) return null;

    const matrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      matrix.push(key.slice(i * size, i * size + size).split('').map(char => char.charCodeAt(0) - 65));
    }
    return matrix;
  }

  createTextVector(text: string): number[] {
    return text.split('').map(char => char.charCodeAt(0) - 65);
  }

  multiplyMatrixVector(matrix: number[][], vector: number[], encrypt: boolean): number[] {
    const result: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < matrix[i].length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum % 26);
    }
    return result;
  }

  vectorToText(vector: number[]): string {
    return vector.map(num => String.fromCharCode(num + 65)).join('');
  }


  // Polyalphabetic Cipher
  polyalphabeticCipher(text: string, key: string, encrypt: boolean): string {
    let result = '';
    const len = key.length;
    for (let i = 0; i < text.length; i++) {
      const shift = key.charCodeAt(i % len) - 97;
      const charCode = text.charCodeAt(i);
      if (encrypt) {
        result += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
      } else {
        result += String.fromCharCode(((charCode - 97 - shift + 26) % 26) + 97);
      }
    }
    return result;
  }

  // One-Time Pad
  oneTimePad(text: string, key: string, encrypt: boolean): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const shift = key.charCodeAt(i) - 97;
      const charCode = text.charCodeAt(i);
      if (encrypt) {
        result += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
      } else {
        result += String.fromCharCode(((charCode - 97 - shift + 26) % 26) + 97);
      }
    }
    return result;
  }



}
