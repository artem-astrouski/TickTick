export type LoginForm = {
  password: string;
  email: string;
};

export type TokensPair = {
  refresh: string;
  access: string;
};

export type SignUpForm = {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
};

export type User = {
  email: string;
  first_name: string;
  last_name: string;
};

export type Todo = {
  id: string;
  description: string;
  done: boolean;
};
