import habitManager from '../lib/habitTracker/index.js';

/**
 * Adapter class to integrate L2HabitTracker module with the React Native app
 * Provides methods to sync between the tracker module and app's habit state
 */
class HabitTrackerAdapter {
  /**
   * Initialize or update habits in the tracker from app state
   * @param {Array} habits - Array of habit objects from app state
   */
  syncHabitsToTracker(habits) {
    // Clear existing habits in tracker
    const existingHabits = habitManager.getAllHabits();
    existingHabits.forEach(habit => {
      try {
        habitManager.deleteHabit(habit.id);
      } catch (e) {
        // Ignore errors if habit doesn't exist
      }
    });

    // Add habits to tracker with their completions
    habits.forEach(habit => {
      try {
        // Create habit if it doesn't exist
        if (!habitManager.getHabit(habit.id)) {
          habitManager.createHabit(habit.id, habit.title, {
            allowMissedDays: false,
            maxMissedDays: 0
          });
        }

        // Add all completion dates
        if (habit.completions && Array.isArray(habit.completions)) {
          habit.completions.forEach(dateStr => {
            try {
              habitManager.addCompletion(habit.id, new Date(dateStr));
            } catch (e) {
              // Ignore duplicate completions
            }
          });
        }
      } catch (e) {
        console.error(`Error syncing habit ${habit.id}:`, e);
      }
    });
  }

  /**
   * Calculate streak for a habit using the tracker module
   * @param {string} habitId - The habit ID
   * @returns {number} Current streak count
   */
  getStreak(habitId) {
    try {
      return habitManager.getCurrentStreak(habitId);
    } catch (e) {
      console.error(`Error getting streak for ${habitId}:`, e);
      return 0;
    }
  }

  /**
   * Add a completion for a habit
   * @param {string} habitId - The habit ID
   * @param {Date} date - The completion date
   * @returns {boolean} True if completion was added
   */
  addCompletion(habitId, date = new Date()) {
    try {
      return habitManager.addCompletion(habitId, date);
    } catch (e) {
      console.error(`Error adding completion for ${habitId}:`, e);
      return false;
    }
  }

  /**
   * Remove a completion for a habit
   * @param {string} habitId - The habit ID
   * @param {Date} date - The completion date to remove
   * @returns {boolean} True if completion was removed
   */
  removeCompletion(habitId, date) {
    try {
      return habitManager.removeCompletion(habitId, date);
    } catch (e) {
      console.error(`Error removing completion for ${habitId}:`, e);
      return false;
    }
  }

  /**
   * Check if a habit's streak is broken
   * @param {string} habitId - The habit ID
   * @returns {boolean} True if streak is broken
   */
  isStreakBroken(habitId) {
    try {
      return habitManager.isStreakBroken(habitId);
    } catch (e) {
      console.error(`Error checking streak for ${habitId}:`, e);
      return true;
    }
  }

  /**
   * Get completions for a habit
   * @param {string} habitId - The habit ID
   * @returns {Array} Array of completion dates
   */
  getCompletions(habitId) {
    try {
      const habit = habitManager.getHabit(habitId);
      return habit ? habit.getCompletions() : [];
    } catch (e) {
      console.error(`Error getting completions for ${habitId}:`, e);
      return [];
    }
  }
}

export default new HabitTrackerAdapter();
