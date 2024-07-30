import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { Todo } from 'src/common/models';

/* ------------- Types ------------- */
type Props = {
  todo: Todo;
  onDelete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
};

/* ------------- Component ------------- */
const TodoItem: React.FC<Props> = props => {
  const { todo, onUpdate, onDelete } = props;

  const handleComplete = useCallback(() => {
    onUpdate({ ...todo, done: !todo.done });
  }, [onUpdate, todo]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo.id]);

  console.log(todo);
  return (
    <Card style={todo.done ? styles.card_done : styles.card}>
      <Text variant={'bodyMedium'}>{todo.description}</Text>

      <Card.Actions style={styles.btnsBlock}>
        <Button children={!todo.done ? 'Complete' : 'Incomplete'} mode={'text'} onPress={handleComplete} />
        <Button children={'Delete'} mode={'text'} onPress={handleDelete} />
      </Card.Actions>
    </Card>
  );
};

export default memo(TodoItem);

/* ------------- Styles ------------- */
const styles = StyleSheet.create({
  card: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  card_done: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#dcd9d9',
  },
  btnsBlock: {
    padding: 0,
  },
});
