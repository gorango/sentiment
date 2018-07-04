/**
 * AFINN-based sentiment analysis for Javascript.
 *
 * Written for performance. At least twice as fast as alternative implementations.
 *
 * Adapted from https://github.com/thisandagain/sentiment
 * @author Andrew Sliwinski <andrewsliwinski@acm.org>
**/

const afinn = require('./AFINN.js')

const tokenize = input => input
  .toLowerCase()
  .replace(/[^a-z0-9á-úñäâàéèëêïîöôùüûœç\-' ]+/g, '')
  .replace('/ {2,}/', ' ')
  .split(' ')


// These words "flip" the sentiment of the following word.
const negators = {
  'cant': 1,
  'can\'t': 1,
  'dont': 1,
  'don\'t': 1,
  'doesnt': 1,
  'doesn\'t': 1,
  'no': 1,
  'not': 0.5,
  'non': 1,
  'wont': 1,
  'won\'t': 1,
  'isnt': 1,
  'isn\'t': 1
}

/**
 * Performs sentiment analysis on the provided input 'phrase'.
 *
 * @param {String} Input phrase
 * @param {Object} Optional sentiment additions to AFINN (hash k/v pairs)
 *
 * @return {Object}
 */
export default function (phrase = '') {
  const tokens = tokenize(phrase)
  const words = []
  const positive = []
  const negative = []
  let score = 0

  let len = tokens.length
  while (len--) {
    const obj = tokens[len]
    let item = afinn[obj]
    if (!afinn.hasOwnProperty(obj)) continue

    if (len > 0) {
      const prevtoken = tokens[len - 1]
      if (negators[prevtoken]) item = -item
    }

    words.push(obj)
    if (item > 0) positive.push(obj)
    if (item < 0) negative.push(obj)

    score += item
  }

  return {
    score,
    comparative: score / tokens.length,
    // tokens,
    words,
    positive,
    negative
  }
}
