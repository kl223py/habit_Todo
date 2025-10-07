import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Portal, Dialog, TextInput, Button, Card, IconButton, Text, Checkbox } from 'react-native-paper';
import { saveTodos, loadTodos } from '../utils/storage';

const TodosScreen = () => {
  const [todos, setTodos] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedTodos = await loadTodos();
    setTodos(loadedTodos);
  };

  const openDialog = (todo = null) => {
    if (todo) {
      setEditingTodo(todo);
      setTitle(todo.title);
      setDescription(todo.description);
    } else {
      setEditingTodo(null);
      setTitle('');
      setDescription('');
    }
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setEditingTodo(null);
    setTitle('');
    setDescription('');
  };

  const saveTodo = async () => {
    if (!title.trim()) return;

    let updatedTodos;
    if (editingTodo) {
      updatedTodos = todos.map(t =>
        t.id === editingTodo.id
          ? { ...t, title, description }
          : t
      );
    } else {
      const newTodo = {
        id: Date.now().toString(),
        title,
        description,
        done: false,
        createdAt: new Date().toISOString(),
      };
      updatedTodos = [...todos, newTodo];
    }

    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
    closeDialog();
  };

  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter(t => t.id !== id);
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const toggleTodo = async (id) => {
    const updatedTodos = todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const renderTodo = ({ item }) => (
    <Card style={[styles.card, item.done && styles.cardDone]}>
      <Card.Content>
        <View style={styles.todoHeader}>
          <Checkbox
            status={item.done ? 'checked' : 'unchecked'}
            onPress={() => toggleTodo(item.id)}
          />
          <View style={styles.todoContent}>
            <Text
              variant="titleMedium"
              style={[styles.todoTitle, item.done && styles.todoTitleDone]}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text
                variant="bodyMedium"
                style={[styles.todoDescription, item.done && styles.todoDescriptionDone]}
              >
                {item.description}
              </Text>
            ) : null}
          </View>
          <View style={styles.todoActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => openDialog(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteTodo(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium">No todos yet</Text>
            <Text variant="bodyMedium">Tap + to add your first todo</Text>
          </View>
        }
      />
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>{editingTodo ? 'Edit Todo' : 'New Todo'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={saveTodo}>Save</Button>
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
  cardDone: {
    opacity: 0.6,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  todoContent: {
    flex: 1,
    marginLeft: 8,
  },
  todoTitle: {
    marginBottom: 4,
  },
  todoTitleDone: {
    textDecorationLine: 'line-through',
  },
  todoDescription: {
    color: '#666',
  },
  todoDescriptionDone: {
    textDecorationLine: 'line-through',
  },
  todoActions: {
    flexDirection: 'row',
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

export default TodosScreen;
