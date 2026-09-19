import * as React from 'react';

type CacheFunction = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result
) => (...args: Args) => Result;

export function requestCache<Args extends unknown[], Result>(
  loader: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = (React as typeof React & { cache?: CacheFunction }).cache;
  return cache ? cache(loader) : loader;
}
