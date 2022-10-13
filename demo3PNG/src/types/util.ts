export type Values<T> = T[keyof T];

export type InnerKeysOf<S, T extends keyof S> = T extends T ? keyof S[T] : never;
