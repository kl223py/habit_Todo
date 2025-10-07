import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Portal, Dialog, TextInput, Button, Card, IconButton, Text, Chip } from 'react-native-paper';
import { saveHabits, loadHabits, getLastResetDate, setLastResetDate } from '../utils/storage';

const HabitsScreen = () => {
  const [habits, setHabits] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    loadData();
    checkDailyReset();
  }, []);

  const loadData = async () => {
    const loadedHabits = await loadHabits();
    setHabits(loadedHabits);
  };

  const checkDailyReset = async () => {
    const lastReset = await getLastResetDate();
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      // New day - reset all habits completion status
      const loadedHabits = await loadHabits();
      const resetHabits = loadedHabits.map(habit => ({
        ...habit,
        completedToday: false,
      }));
      setHabits(resetHabits);
      await saveHabits(resetHabits);
      await setLastResetDate(today);
    }
  };

  const openDialog = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setTitle(habit.title);
      setEmoji(habit.emoji);
      setFrequency(habit.frequency);
    } else {
      setEditingHabit(null);
      setTitle('');
      setEmoji('');
      setFrequency('');
    }
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditingHabit(null);
    setTitle('');
    setEmoji('');
    setFrequency('');
  };

  const saveHabit = async () => {
    if (!title.trim()) return;

    let updatedHabits;
    if (editingHabit) {
      updatedHabits = habits.map(h =>
        h.id === editingHabit.id
          ? { ...h, title, emoji, frequency }
          : h
      );
    } else {
      const newHabit = {
        id: Date.now().toString(),
        title,
        emoji: emoji || '⭐',
        frequency: frequency || 'Daily',
        streak: 0,
        completedToday: false,
        lastCompleted: null,
      };
      updatedHabits = [...habits, newHabit];
    }

    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
    closeDialog();
  };

  const deleteHabit = async (id) => {
    const updatedHabits = habits.filter(h => h.id !== id);
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const toggleHabitCompletion = async (habit) => {
    const today = new Date().toDateString();
    let newStreak = habit.streak;
    
    if (!habit.completedToday) {
      // Completing the habit
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastCompleted === yesterday || !lastCompleted) {
        newStreak = habit.streak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      // Uncompleting the habit
      newStreak = Math.max(0, habit.streak - 1);
    }

    const updatedHabits = habits.map(h =>
      h.id === habit.id
        ? {
            ...h,
            completedToday: !h.completedToday,
            streak: newStreak,
            lastCompleted: !h.completedToday ? today : h.lastCompleted,
          }
        : h
    );

    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const renderHabit = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.habitHeader}>
          <View style={styles.habitTitle}>
            <Text variant="headlineMedium">{item.emoji}</Text>
            <View style={styles.habitInfo}>
              <Text variant="titleMedium">{item.title}</Text>
              <Text variant="bodySmall">{item.frequency}</Text>
            </View>
          </View>
          <View style={styles.habitActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => openDialog(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteHabit(item.id)}
            />
          </View>
        </View>
        <View style={styles.habitFooter}>
          <Chip
            icon="fire"
            style={styles.streakChip}
          >
            {item.streak} day streak
          </Chip>
          <Button
            mode={item.completedToday ? "contained" : "outlined"}
            onPress={() => toggleHabitCompletion(item)}
          >
            {item.completedToday ? '✓ Done' : 'Mark Done'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium">No habits yet</Text>
            <Text variant="bodyMedium">Tap + to add your first habit</Text>
          </View>
        }
      />
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>{editingHabit ? 'Edit Habit' : 'New Habit'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Emoji"
              value={emoji}
              onChangeText={setEmoji}
              mode="outlined"
              placeholder="⭐"
              style={styles.input}
            />
            <TextInput
              label="Frequency"
              value={frequency}
              onChangeText={setFrequency}
              mode="outlined"
              placeholder="Daily"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={saveHabit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => openDialog()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitInfo: {
    marginLeft: 12,
    flex: 1,
  },
  habitActions: {
    flexDirection: 'row',
  },
  habitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  streakChip: {
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  input: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HabitsScreen;
