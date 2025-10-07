class StreakCalculator {
  static getCurrentStreak(completions, allowMissedDays = false, maxMissedDays = 0) {
    if (!completions || completions.length === 0) {
      return 0
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let currentStreak = 0
    let currentDate = new Date(today)
    let missedDaysCount = 0

    if (!this._hasCompletionOnDate(completions, today)) {
      currentDate.setDate(currentDate.getDate() - 1)
      if (!this._hasCompletionOnDate(completions, currentDate)) {
        return 0
      }
    }

    while (true) {
      if (this._hasCompletionOnDate(completions, currentDate)) {
        currentStreak++
        missedDaysCount = 0
      } else {
        if (allowMissedDays && missedDaysCount < maxMissedDays) {
          missedDaysCount++
        } else {
          break
        }
      }

      currentDate.setDate(currentDate.getDate() - 1)

      if (currentStreak > 365) {
        break
      }
    }

    return currentStreak
  }

  static isStreakBroken(completions, allowMissedDays = false, maxMissedDays = 0) {
    if (!completions || completions.length === 0) { 
      return true
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (this._hasCompletionOnDate(completions, today)) {
      return false
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (this._hasCompletionOnDate(completions, yesterday)) {
      return !allowMissedDays || maxMissedDays < 1
    }

    const sortedCompletions = [...completions].sort((a, b) => a - b)
    const lastCompletion = sortedCompletions[sortedCompletions.length - 1]
    const daysSince = this._daysBetween(today, lastCompletion)

    if (allowMissedDays) {
      return daysSince > (maxMissedDays + 1)
    }

    return daysSince > 1
  }

  static _hasCompletionOnDate(completions, targetDate) {
    return completions.some(completion => {
      const compDate = new Date(completion)
      compDate.setHours(0, 0, 0, 0)
      return compDate.getTime() === targetDate.getTime()
    })
  }

  static _daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.abs(Math.round(date1 - date2) / oneDay)
  }
}

module.exports = StreakCalculator
