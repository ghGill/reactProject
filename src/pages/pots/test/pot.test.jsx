import { expect, test } from 'vitest'
import { calcSavedPercents } from '../Pots'

test('Calc saved in percents', () => {
    expect(calcSavedPercents(30, 60)).toBe("50.00");
})

test('Calc saved in percents 2', () => {
    expect(calcSavedPercents(35, 80)).toBe("43.75");
})

test('Calc saved in percents, saved=undefined', () => {
    expect(calcSavedPercents(undefined, 80)).toBe("0.00");
})

test('Calc saved in percents, target=undefined', () => {
    expect(calcSavedPercents(50, undefined)).toBe("0.00");
})
