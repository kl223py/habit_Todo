class Habit {
  constructor(id, name ,options = {}) {
    this.id = id
    this.name = name
    this.completions = []
    this.allowMissedDays = options.allowMissedDays || false
    this.maxMissedDays = options.maxMissedDays || 0
  }

  addCompletion(date) {
    const completionDate = new Date(date)
    completionDate.setHours(0, 0, 0, 0)

    if (this.hasCompletionOnDate(completionDate))  {
      return false
    }

    this.completions.push(completionDate)
    this._sortCompletions()
    return true
  }

  removeCompletion(date) {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    const initialLength = this.completions.length
    this.completions = this.completions.filter(completion =>
      !this._isSameDay(completion, targetDate)
    )

    return this.completions.length < initialLength
  }

  getCompletions() {
    return [...this.completions]
  }

  hasCompletionOnDate(date) {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    return this.completions.some(completion =>
      this._isSameDay(completion, targetDate)
    )
  }
  
  _isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()      
    )
  }

  _sortCompletions() {
    this.completions.sort((a, b) => a - b) 
  }
}

module.exports = Habit
