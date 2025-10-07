import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habitflow_habits';
const TODOS_KEY = '@habitflow_todos';
const LAST_RESET_KEY = '@habitflow_last_reset';

// Habits storage functions
export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const loadHabits = async () => {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

// Todos storage functions
export const saveTodos = async (todos) => {
  try {
    await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
  }
};

export const loadTodos = async () => {
  try {
    const data = await AsyncStorage.getItem(TODOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
};

// Last reset date functions
export const getLastResetDate = async () => {
  try {
    const date = await AsyncStorage.getItem(LAST_RESET_KEY);
    return date || null;
  } catch (error) {
    console.error('Error getting last reset date:', error);
    return null;
  }
};

export const setLastResetDate = async (date) => {
  try {
    await AsyncStorage.setItem(LAST_RESET_KEY, date);
  } catch (error) {
    console.error('Error setting last reset date:', error);
  }
};
