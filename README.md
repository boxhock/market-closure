# Market Closure Helper

This repo helps with checking if a market is currently closed according to a predefined schedule. 

## Usage

```javascript
const { MarketClosure } = require('market-closure')
```

## MarketClosure

Expects a timezone (e.g. "Europe/London"). See Luxon's documentation for more information:
https://moment.github.io/luxon/docs/manual/zones

Hours is the trading hours per day where the market is open. See checkIfInHours() for more information on how this
works. This object can be omitted or set to null to consider all days open. If a day is not included, then the entire
day is considered closed.

Holidays is an array of holidays where the market is closed. See checkIfInHolidays() for more information.

```javascript
const schedule = {
    // We are using the London Stock Exchange, so set the local timezone to "Europe/London"
    "timezone": "Europe/London",
    // Hours is the regular trading hours. In this set, we only show Monday and Tuesday as open.
    "hours": {
        // We have two sets of trading hours per day: 08-12, then lunch break, then 13-16
        "monday": ["08:00-12:00", "13:00-16:00"],
        "tuesday": ["08:00-12:00", "13:00-16:00"]
    },
    // Holidays are scheduled days where the market is closed
    "holidays": [
        {
            "year": 2020,
            "month": 5,
            "day": 8,
            // We can set the specific hours in the day where the market is closed.
            // In this case, the market is open until 12:30 local time.
            "hours": "12:30-23:59"
        },
        {
            "year": 2020,
            "month": 12,
            "day": 25
            // Here we have omitted the hours, so we consider the entire day closed.
        }
    ]
}
```

#### Arguments

* `schedule` (Object): The schedule config for this market. See example above.

### tradingHalted

Checks if trading is halted according to the schedule/config provided earlier. It will check both `isInTradingHours()`
and `isInHolidays()` using the current time of the time zone provided. 

If no time zone was provided, this will always return `false`.

### isInTradingHours

Checks to see if the time provided is within the scheduled trading hours of the market. Returns `true` when local time
is within trading hours (market is open).

#### Arguments

* `t` (DateTime): The local time to check against

### isInHolidays

Checks to see if the time provided is within a scheduled holiday. Returns `true` when local time is within a holiday (
market is closed).

#### Arguments

* `t` (DateTime): The local time to check against
