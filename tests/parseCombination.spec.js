/* eslint-env node, mocha */
import {expect} from 'chai'
import parseCombination from '../src/parseCombination.js'
import combinations from '../src/static/combinations.js'

describe('parsing attribute combination names', () => {
  it('parses the name based on the main attribute', () => {
    expect(parseCombination({Power: 126, Precision: 85, Ferocity: 85}).prefix).to.equal('Berserker\'s')
  })

  it('parses the name even if the stats are flipped', () => {
    expect(parseCombination({Precision: 85, Power: 126, Ferocity: 85}).prefix).to.equal('Berserker\'s')
  })

  it('parses the correct name for items with other main stats', () => {
    expect(parseCombination({Precision: 126, Power: 85, Ferocity: 85}).prefix).to.equal('Assassin\'s')
    expect(parseCombination({Power: 85, Precision: 126, Ferocity: 85}).prefix).to.equal('Assassin\'s')
    expect(parseCombination({Power: 85, Ferocity: 85, Precision: 126}).prefix).to.equal('Assassin\'s')
    expect(parseCombination({Ferocity: 85, Power: 85, Precision: 126}).prefix).to.equal('Assassin\'s')
  })

  it('parses a invalid combination', () => {
    let attributes = {NonExisting: 1}
    expect(parseCombination(attributes)).to.equal(false)
  })

  it('discards invalid attributes (e.g. for old ascended items)', () => {
    expect(parseCombination({Power: 126, Precision: 85, Ferocity: 85, AgonyResistance: 5}).prefix).to.equal('Berserker\'s')
  })

  it('parses the correct name for items with single stats', () => {
    expect(parseCombination({Power: 123}).prefix).to.equal('Mighty')
  })

  it('parses the correct name for items with quadruple stats', () => {
    expect(parseCombination({Power: 121, ConditionDamage: 121, Precision: 67, Expertise: 67}).prefix).to.equal('Viper\'s')
  })

  it('parses the correct name for items with septuple stats', () => {
    expect(parseCombination({
      Power: 67,
      Precision: 67,
      Toughness: 67,
      Vitality: 67,
      ConditionDamage: 67,
      HealingPower: 67,
      Ferocity: 67
    }).prefix).to.equal('Celestial')

    expect(parseCombination({
      ConditionDamage: 67,
      Power: 67,
      Precision: 67,
      Toughness: 67,
      Vitality: 67,
      HealingPower: 67,
      Ferocity: 67
    }).prefix).to.equal('Celestial')
  })

  it('includes all keys and valid attributes for all combinations', () => {
    let validAttributes = ['Power', 'Toughness', 'Vitality', 'Precision', 'Ferocity', 'ConditionDamage', 'ConditionDuration', 'HealingPower', 'BoonDuration', 'Concentration', 'Expertise']
    for (let i = 0; i !== combinations.length; i++) {
      let invalidAttributes = combinations[i].attributes[0].filter(x => validAttributes.indexOf(x) === -1).length +
        combinations[i].attributes[1].filter(x => validAttributes.indexOf(x) === -1).length
      expect(invalidAttributes, 'Invalid attributes for ' + combinations[i].text.prefix).to.equal(0)
      expect(Object.keys(combinations[i].text)).to.deep.equal(['prefix', 'suffix', 'trinket', 'ascended'])
    }
  })
})
