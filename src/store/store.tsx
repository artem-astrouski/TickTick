import React, { createContext, ReactNode, useReducer } from 'react';

import { Todo } from 'src/common/models';
import { KeyValueRepository } from 'src/repositories/key-value-repository';

/* ------------- Types ------------- */
interface State {
  todos: Todo[];
  auth: {
    accessToken?: string;
  };
}

type ActionType =
  | { type: 'GET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'ADD_TOKEN'; payload: { accessToken: string } }
  | { type: 'CLEAR_STORE' };

/* ------------- Reducer ------------- */
const initialState: State = {
  todos: [],
  auth: {
    accessToken: KeyValueRepository.getItem('accessToken'),
  },
};

const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'GET_TODOS': {
      return { ...state, todos: action.payload };
    }
    case 'ADD_TODO': {
      return { ...state, todos: [...state.todos, action.payload] };
    }
    case 'UPDATE_TODO': {
      return {
        ...state,
        todos: state.todos.map(todo => (todo.id === action.payload.id ? action.payload : todo)),
      };
    }
    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }
    case 'ADD_TOKEN': {
      return {
        ...state,
        auth: {
          accessToken: action.payload.accessToken,
        },
      };
    }
    case 'CLEAR_STORE': {
      return {
        todos: [],
        auth: {
          accessToken: undefined,
        },
      };
    }

    default:
      return state;
  }
};

/* ------------- StoreProvider ------------- */
const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<React.Dispatch<ActionType>>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

/* ------------- Hooks ------------- */
export const useStore = () => {
  const state = React.useContext(StateContext);
  if (state === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return state;
};

export const useDispatch = () => {
  const dispatch = React.useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error('useDispatch must be used within a StoreProvider');
  }
  return dispatch;
};
