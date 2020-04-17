const {DateTime} = require("luxon")

class MarketClosure {
    // Expects a timezone (e.g. "Europe/London"). See Luxon's documentation for more information:
    // https://moment.github.io/luxon/docs/manual/zones
    // Hours is the trading hours per day where the market is open. See checkIfInHours() for more information on how
    // this works. This object can be omitted or set to null to consider all days open.
    // Holidays is an array of holidays where the market is closed. See checkIfInHolidays() for more information.
    constructor(schedule) {
        this.timezone = schedule.timezone || ""
        this.hours = schedule.hours || null
        this.holidays = schedule.holidays || []
    }

    // tradingHalted() returns true if the current time in the defined timezone is within a defined holiday
    // or if the time is not currently in one of the defined trading hours (if any are defined).
    tradingHalted = () => {
        if (this.timezone === "")
            return false

        const curTime = DateTime.local().setZone(this.timezone)

        return !this.isInTradingHours(curTime) || this.isInHolidays(curTime)
    }

    // inTimespan() checks to see if the time provided is within the timespan of format "hh:mm-hh:mm"
    #inTimespan = (t, timespan) => {
        const times = timespan.split('-')

        // Check for malformed timespan
        if (times.length !== 2) {
            return false
        }

        // Contains a Lambda function to convert strings to numbers in JS
        const start = times[0].split(':').map(x => +x)
        if (start.length !== 2) {
            return false
        }

        if (t.hour < start[0] || (t.hour === start[0] && t.minute < start[1])) {
            return false
        }

        const end = times[1].split(':').map(x => +x)
        if (end.length !== 2) {
            return false
        }

        if (t.hour > end[0] || (t.hour === end[0] && t.minute > end[1])) {
            return false
        }

        return true
    }

    // Expects an object of days with an array of trading hours. Eg:
    // {
    //   monday: ["08:00-12:00", "13:00-16:00"],
    //   tuesday: ["08:00-12:00", "13:00-16:00"]
    // }
    // If a day is not included, then the entire day is considered closed.
    isInTradingHours = (t) => {
        if (this.hours === null)
            return false

        const weekday = t.weekdayLong.toLowerCase()

        // If the weekday is not in our object, we consider
        // it a day off
        if (typeof this.hours[weekday] === "undefined")
            return false

        for (let i = 0; i < this.hours[weekday].length; i++) {
            const timespan = this.hours[weekday][i]
            if (this.#inTimespan(t, timespan))
                return true
        }

        return false
    }

    // Expects an array of objects with holidays. E.g.
    // [
    //   {
    //     year: 2020,
    //     month: 5,
    //     day: 8,
    //     hours: "12:30-23:59"
    //   },
    //   {
    //     year: 2020,
    //     month: 5,
    //     day: 9,
    //     hours: "00:00-23:59"
    //   }
    // ]
    // The hours is the time the markets are closed.
    // Hours can be omitted to consider the entire day as closed.
    isInHolidays = (t) => {
        for (let i = 0; i < this.holidays.length; i++) {
            const day = this.holidays[i]

            if (t.year !== day.year || t.month !== day.month || t.day !== day.day) {
                continue
            }

            // If there are no hours assigned to this holiday, we consider the entire day off.
            // Otherwise, check if we're inside the timespan for closed hours.
            if (typeof day.hours === "undefined" || day.hours === "" || this.#inTimespan(t, day.hours)) {
                return true
            }
        }

        return false
    }
}

exports.MarketClosure = MarketClosure
