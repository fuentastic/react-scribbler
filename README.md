
# useHumanWriter

A React hook that simulates human-like typing. This hook is perfect for creating typewriter effects, with customizable typing speeds, backspacing, pauses, and random typing errors to mimic human typing behavior.

## Installation

Install `useHumanWriter` using npm:

```bash
npm install use-human-writer
```

Or using yarn:

```bash
yarn add use-human-writer
```

## Usage

Import `useHumanWriter` into your React component and pass an array of messages along with optional configuration options.

```tsx
import React from 'react';
import { useHumanWriter } from 'use-human-writer';

const ExampleComponent = () => {
  const message = useHumanWriter(["Hello", "World"], {
    baseTypeSpeed: 120,
    baseBackspaceSpeed: 100,
    pauseDelay: 1000,
    errorChance: 0.05
  });

  return <div>{message}</div>;
};

export default ExampleComponent;
```

## API

`useHumanWriter(messages, options)`

### Parameters

- `messages` (string[]): An array of messages to be typed.
- `options` (object): (Optional) Configuration options for typing behavior.
  - `baseTypeSpeed` (number): Base speed for typing, in milliseconds. Default is 120.
  - `baseBackspaceSpeed` (number): Base speed for backspacing, in milliseconds. Default is 100.
  - `pauseDelay` (number): Delay time between typing and backspacing, in milliseconds. Default is 1000.
  - `errorChance` (number): Probability of making a random error while typing. Default is 0.05.

## Example

Here's a simple example of how `useHumanWriter` can be used in a React component:

```tsx
import React from 'react';
import { useHumanWriter } from 'use-human-writer';

function Typewriter() {
  const typewrittenText = useHumanWriter(["First message", "Second message"], {
    baseTypeSpeed: 100,
    errorChance: 0.1
  });

  return <div>{typewrittenText}</div>;
}

export default Typewriter;
```

## License

This project is licensed under the [MIT License](LICENSE).
