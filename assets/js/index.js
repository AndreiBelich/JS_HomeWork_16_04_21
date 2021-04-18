"use strict";

/*1. Написать функцию, которая проверяет, являются ли два слова анаграммами.
 (Анаграммы - слова, которые имеют одинаковую длину и состоят из одних и тех же букв, но в разном порядке. Пример: "воз", "зов")
Регистр букв не имеет значения. */
  
const isAnagram = (word1, word2) => [...word1.toLowerCase()].sort().join() === [...word2.toLowerCase()].sort().join();

const testAnagram = {
  "риГа": "игра",
  "5аВОз7" : "ЗоВа75",
  "ВОЗ" : "зов",
  "aab" : "abb",
  "abc4de" : "45olkjnt"
};

for(const key in testAnagram){
  console.log(`Call isAnagram() for key: ${key}, and value: ${testAnagram[key]}, result = ${isAnagram(key, testAnagram[key])}`);
  console.log("---------------------------------------------------------------------------");
}

/*2. Написать функцию, которая подсчитывает количество гласных в строке.*/

console.log("Task 2");
const lettersCounter = (str, letters) => [...str.toLowerCase()].filter((letter) => letters.includes(letter)).length;

const testLettersCounter = (sentences, letters) => {
  for(const sentence of sentences){
    console.log(`String ${sentence} contains ${lettersCounter(sentence, letters)} vowel letters.`);
  }
}

const RUSSIAN_VOWEL = ["а", "у", "о", "ы", "и", "э", "я", "ю", "ё", "е"];
const ENGLISH_VOWEL = ["a", "e", "i", "o", "u", "y"];

const rusSentences = [
  "А роза упалА на лапу азОра",
  "аУоЫиЭяюеё",
  "вртрь глктк"
];

const engSentences = [
  "To be OR noT tO Be",
  "aioUyE",
  "hrs nvr d"
];

testLettersCounter(rusSentences, RUSSIAN_VOWEL);
testLettersCounter(engSentences, ENGLISH_VOWEL);

/*3 Написать функцию, которая принимает массив с числами и
 возвращает новый массив, который содержит отрицательные числа из первого массива.*/
console.log("Task 3");
const chooseNegativeNumbers = (numbers) => numbers.filter((number) => number < 0);

console.log(chooseNegativeNumbers([1, 2, 3, 4, 5, 6, 7]));//[]
console.log(chooseNegativeNumbers([-2, 8, -100, 10, 12, -3, 15, 45, 20, -4]));//[-2, -100, -3, -4]
console.log(chooseNegativeNumbers([-3, -4, -7, -9, -10]));//[-3, -4, -7, -9, -10]

/*4 Написать функцию, которая принимает массив и возвращает новый массив,
 состоящий только из уникальных значений первого массива (значения не должны повторяться).*/

 /**
  * Функция возвращает массив уникальных значений. Допустимые типы данных: number, string, array[string | number], object
  * В массивах и объектах не предусмотрена вложенность других структур
  * @param {array} data 
  * @returns array
  */
const uniqueValues = (data) => {
  const NUMBER_SUFFIX = "__N";
  const STRING_SUFFIX = "__S";
  const OBJECT_SUFFIX = "__O";
  const NUMBERS_ARRAY_SUFFIX = "_NA";
  const STRINGS_ARRAY_SUFFIX = "_SA";
  const MIX_ARRAY_SUFFIX = "_MA";
  const SEPARATOR = "|";
  const OBJECT_SEPARATOR = ":";
  const obj = {};
  for(const item of data){
    let key = null;
    switch(typeof(item)){
      case "number":
        key = item + NUMBER_SUFFIX;
        break;
      case "string":
        key = item + STRING_SUFFIX;
        break;
      case "object":
         /*Рассмотрены следующие варианты массивов:
              1. Массив чисел
              2. Массив строк
              3. Смешанный массив состоящий из строк и чисел
              4. Так же рассмотрен объект, объекты типа {a: 1, b : 2} и {b : 2, a : 1} считаются одинаковыми
        */
        if(Array.isArray(item)){
          if(item.every((val) => typeof(val) === "number")){
            key = item.join(SEPARATOR) + NUMBERS_ARRAY_SUFFIX;
          }else if(item.some((val) => typeof(val) === "number")){
            key = "";
            for(const value of item){
              if(typeof(value) === "number"){
                key += value + NUMBER_SUFFIX + " ";
              }else if(typeof(value) === "string"){
                key += value + STRING_SUFFIX + " ";
              }
            }
            key = key.trim()
                     .split(" ")
                     .join(SEPARATOR) + MIX_ARRAY_SUFFIX;
          }else{
            key = item.join(SEPARATOR) + STRINGS_ARRAY_SUFFIX;
          }
        }else{
          key = "";
          const objectKeys = Object.keys(item).sort();
          for(const itemKey of objectKeys){
            key += `${itemKey}:${item[itemKey]} `;
          }
          key = key.trim()
                   .split(" ")
                   .join(SEPARATOR) + OBJECT_SUFFIX;
        }
        break;
    default:
      throw new TypeError("Unknown Type");
    }
    obj[key] = obj[key] ? ++obj[key] : 1;
  }
  const result = [];
  for(const key in obj){
    if(obj[key] === 1){
      let value = null;
      switch(key.slice(key.length - NUMBER_SUFFIX.length)){
        case NUMBER_SUFFIX:
          value = parseInt(key);
          break;
        case STRING_SUFFIX:
          value = key.slice(0, key.length - STRING_SUFFIX.length);
          break;
        case NUMBERS_ARRAY_SUFFIX:
          value = key.slice(0, key.length - NUMBERS_ARRAY_SUFFIX.length)
                     .split(SEPARATOR)
                     .map((val) => +val);
          break;
        case STRINGS_ARRAY_SUFFIX:
          value = key.slice(0, key.length - STRINGS_ARRAY_SUFFIX.length)
                     .split(SEPARATOR);
          break;
        case MIX_ARRAY_SUFFIX:
          value = key.slice(0, key.length - MIX_ARRAY_SUFFIX.length)
                     .split(SEPARATOR)
                     .map((val) => val.endsWith(NUMBER_SUFFIX) ? parseInt(val) : val.slice(0, val.length - STRING_SUFFIX.length));
          break;
        case OBJECT_SUFFIX:
          value = key.slice(0, key.length - OBJECT_SUFFIX.length)
                     .split(SEPARATOR)
                     .reduce((acc, nextValue) => {
                        const [key, value] = nextValue.split(OBJECT_SEPARATOR);
                        acc[key] = value;
                        return acc;
                      }, {});
          break;
        default:
          break;
    }
    result.push(value);
    }
  }
  return result;
 }

const testData = [
  [7, 7, 7, 7, 7, 7],
  [1, 2, 2, 3, 3, 2, 5, 6, 6, 6, 8, 10, 25, 24, 24, 30],
  ["apple", "Apple", "apple", "orange", "orange", "orange", "BaNaNa", "BaNaNa", "BanaNa", "some text", "try", "try", "catcH"],
  ["__N", "__S", "_NA", "_SA", "_MA", "text__S", "8__N", "qwerty_MA", "wtf__S", "__N__N", "8 | 8", "/|", "___"],
  [1, 2, "5", 2, 3, "5", 4, 5, "4", 3, "1"],
  [{a : 1, b : 2}, {c : 4, a : 5}, {b : 2, a : 1}, {a : 8, c : 10}],
  [[8, 8, 8], [9, 9, 9], [8, 9, 10, 11, 15], [8, 9, 10], [9, 9, 9], [7, 5, 3], [8, 9, 10]],
  [[8, "9", 10], ["8", 9, 10], ["8", "9", "10"], [7, 7, "5"], [7, 7, "5"], [7, "7", 5]],
  [10, "10", {name: "Igor", surname: "Lunin"}, 11, "11", {name: "Olga", surname: "Polyakova"},
   11, [1, 3, 5, 7], "11", ["1", "3", "5", "7"], "hello", "d4c", {surname: "Lunin", name: "Igor"}]
];

console.log("\n\nTest uniqueValues\n\n");
for(const item of testData){
  console.log(item);
  console.log("Call uniqueValues()");
  console.log(uniqueValues(item));
  console.log("---------------------------------------------------------------------------");
}
  