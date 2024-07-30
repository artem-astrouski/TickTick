import React, { memo, useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { deleteTodo, getTodos, postTodo, putTodo } from 'src/common/api';
import { Todo } from 'src/common/models';
import TodoItem from 'src/components/TodoItem';
import { useDispatch, useStore } from 'src/store/store';

const keyExtractor = item => item.id;

/* ------------- Screen ------------- */
const Home = () => {
  const { todos } = useStore();
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const todosData = await getTodos();
      if (todosData) {
        dispatch({ type: 'GET_TODOS', payload: todosData });
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error fetching todo list');
    }
  }, [dispatch]);

  const updateTodo = useCallback(
    async (todo: Todo) => {
      try {
        await putTodo(todo);
        dispatch({ type: 'UPDATE_TODO', payload: todo });
      } catch (e) {
        console.error(e);
        Alert.alert('Error updating todo');
      }
    },
    [dispatch],
  );

  const deleteTodoItem = useCallback(
    async (id: string) => {
      try {
        await deleteTodo(id);
        dispatch({ type: 'DELETE_TODO', payload: { id } });
      } catch (e) {
        console.error(e);
        Alert.alert('Error deleting todo');
      }
    },
    [dispatch],
  );

  const onAddTodo = useCallback(async () => {
    try {
      const data = await postTodo(newTodo);
      if (newTodo) {
        dispatch({ type: 'ADD_TODO', payload: data });
        setNewTodo('');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error adding new todo');
    }
  }, [dispatch, newTodo]);

  const renderItem = useCallback<ListRenderItem<Todo>>(
    ({ item }) => {
      return <TodoItem todo={item} onDelete={deleteTodoItem} onUpdate={updateTodo} />;
    },
    [deleteTodoItem, updateTodo],
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.scrollContainer}
        data={todos}
        renderItem={renderItem}
      />
      <View style={styles.footer}>
        <TextInput
          mode="outlined"
          value={newTodo}
          onChangeText={text => setNewTodo(text)}
          placeholder="Enter new Todo"
          style={styles.input}
        />
        <Button disabled={!newTodo.length} children={'Add Todo'} mode={'contained'} onPress={onAddTodo} />
      </View>
    </View>
  );
};

/* ------------- Styles ------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 30,
    paddingVertical: 30,
    rowGap: 20,
  },
  input: {
    marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    paddingTop: 10,
    marginTop: 'auto',
  },
});

export default memo(Home);
