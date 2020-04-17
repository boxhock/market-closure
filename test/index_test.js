const {MarketClosure} = require('../index.js')
const {assert} = require("chai")
const {DateTime} = require("luxon")

describe('isInHolidays', () => {
    const schedule = new MarketClosure({
        holidays: [
            {
                year: 2020,
                month: 1,
                day: 1,
                hours: "12:01-23:59"
            },
            {
                year: 2020,
                month: 1,
                day: 2
            }
        ]
    })
    context('when inside holiday schedule', () => {
        const dt = DateTime.local(2020, 1, 1, 12, 1)
        it('returns true', () => {
            let inHoliday = schedule.isInHolidays(dt)
            assert.isTrue(inHoliday)
        })
    })

    context('when the whole day is a holiday', () => {
        const dt = DateTime.local(2020, 1, 2, 12, 1)
        it('returns true', () => {
            let inHoliday = schedule.isInHolidays(dt)
            assert.isTrue(inHoliday)
        })
    })

    context('when outside holiday schedule', () => {
        const dt = DateTime.local(2020, 1, 1, 12, 0)
        it('returns false', () => {
            let inHoliday = schedule.isInHolidays(dt)
            assert.isFalse(inHoliday)
        })
    })
})

describe('isInTradingHours', () => {
    const schedule = new MarketClosure({
        hours: {
            thursday: ["10:00-11:00", "13:00-14:00"]
        }
    })

    context('when inside trading hours', () => {
        const dt = DateTime.local(2020, 4, 16, 13, 0)
        it('returns true', () => {
            let inTradingHours = schedule.isInTradingHours(dt)
            assert.isTrue(inTradingHours)
        })
    })

    context('when outside trading hours', () => {
        const dt = DateTime.local(2020, 4, 18, 13, 0)
        it('returns false', () => {
            let inTradingHours = schedule.isInTradingHours(dt)
            assert.isFalse(inTradingHours)
        })
    })
})
