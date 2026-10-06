const coursesData = [
  {
    title: 'React Fundamentals',
    slug: 'react-fundamentals',
    category: 'Frontend',
    difficulty: 'Beginner',
    estimatedDuration: '4.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Master modern React components, hooks, state management, and component lifecycles from scratch.',
    description: 'Learn modern React from the ground up. This course covers everything from JSX fundamentals and declarative UI paradigms to custom hooks, controlled forms, side-effects with useEffect, and scalable component architecture. By the end of this course, you will be building responsive, production-ready React applications with confidence.',
    lessons: [
      {
        order: 1,
        title: 'Introduction to React & JSX Architecture',
        duration: '20 mins',
        description: 'Understand the Virtual DOM, declarative UI paradigms, and JSX syntax rules.',
        content: `### Understanding Modern React

React is a declarative, component-based JavaScript library for building user interfaces. Rather than manipulating the browser's Document Object Model (DOM) directly with imperative commands, React introduces a declarative paradigm where your UI is a deterministic function of state:

\`\`\`
UI = f(state)
\`\`\`

#### The Virtual DOM & Reconciliation
When state updates in a React application:
1. React creates a lightweight in-memory representation of the new UI tree.
2. The **Reconciliation** algorithm (Fiber) calculates the minimum difference (the "diff") between the previous tree and the new tree.
3. React batches and flushes only the necessary DOM mutations to the real browser DOM.

#### Anatomy of JSX
JSX is an XML-like syntax extension for JavaScript. It compiles down to \`React.createElement\` function calls:

\`\`\`jsx
function WelcomeCard({ name, role }) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h2 className="text-xl font-bold text-white">Welcome back, {name}!</h2>
      <p className="text-slate-400 mt-1">Role: {role}</p>
    </div>
  );
}
\`\`\`

#### Core Rules of JSX:
- Always return a single top-level root element, or wrap in a React Fragment (\`<>\` ... \`</>\`).
- Attributes use \`camelCase\` (e.g., \`className\` instead of \`class\`, \`htmlFor\` instead of \`for\`).
- Embed any valid JavaScript expression inside curly braces \`{ }\`.`
      },
      {
        order: 2,
        title: 'Component State with useState',
        duration: '25 mins',
        description: 'Learn how to declare, update, and manage local reactive state safely.',
        content: `### Managing Local State with \`useState\`

Components often need to change what's on screen as a result of an interaction. In React, local mutable memory is called **state**.

#### The \`useState\` Hook
The \`useState\` hook accepts an initial state value and returns an array with two elements:
1. The current state variable.
2. The state setter function that triggers a re-render when called.

\`\`\`jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // Best practice: use functional update when next state depends on previous state
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-mono">{count}</span>
      <button 
        onClick={increment}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Increment
      </button>
    </div>
  );
}
\`\`\`

#### Key Rules of State Updates:
- **Never mutate state directly**: Treating state as immutable prevents tricky bugs and ensures React detects changes reliably.
- **Asynchronous batching**: Multiple state updates triggered inside event handlers are batched together by React 18+ to optimize render performance.`
      },
      {
        order: 3,
        title: 'Mastering Side Effects with useEffect',
        duration: '30 mins',
        description: 'Handle data fetching, subscriptions, timer management, and cleanup functions.',
        content: `### Synchronizing with the Outside World

The \`useEffect\` hook lets you synchronize a component with external systems, such as network APIs, browser APIs, timers, or subscriptions.

\`\`\`jsx
import { useState, useEffect } from 'react';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(\`/api/users/\${userId}\`);
        const data = await res.json();
        if (!isCancelled) {
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchUser();

    // Cleanup function runs before re-running effect or unmounting
    return () => {
      isCancelled = true;
    };
  }, [userId]); // Dependency array

  if (loading) return <div>Loading user profile...</div>;
  return <div>{user?.name}</div>;
}
\`\`\`

#### The Dependency Array Explained:
- \`[]\` (Empty array): Runs once after initial mount, cleanup runs on unmount.
- \`[dep1, dep2]\`: Runs after initial mount and whenever any specified dependency changes by reference (\`Object.is\`).
- No array: Runs after every single render (rarely intended).`
      },
      {
        order: 4,
        title: 'Custom Hooks & Reusable Logic',
        duration: '25 mins',
        description: 'Extract and share stateful logic between components without duplicating code.',
        content: `### Extracting Reusable Logic into Custom Hooks

Custom hooks are JavaScript functions whose names start with \`use\` and that can call other React hooks. They let you share stateful logic across multiple components while keeping local state completely isolated.

\`\`\`jsx
import { useState, useEffect } from 'react';

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
\`\`\`

#### Benefits of Custom Hooks:
- **Clean separation of concerns**: Keeps UI components focused on layout and presentation.
- **Easy testability**: Hook logic can be tested in isolation using testing libraries.
- **Zero code duplication**: Any component can consume the hook with one line.`
      },
      {
        order: 5,
        title: 'State Management with Zustand',
        duration: '35 mins',
        description: 'Implement modern, boilerplate-free global client state using Zustand stores.',
        content: `### Global State with Zustand

Zustand is a small, fast, and scalable state-management solution using simplified flux principles. Unlike React Context or Redux, Zustand does not require boilerplate reducers, action creators, or complex provider trees.

\`\`\`jsx
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter((i) => i.id !== id) 
  })),
  clearCart: () => set({ items: [] })
}));
\`\`\`

#### Why Zustand is Preferred in Modern Web Apps:
- Selective re-renders: Components only re-render when the exact piece of state they subscribe to changes.
- Works both inside and outside React components (e.g., inside Axios interceptors or utility functions).
- Clean async action handling right inside the store definitions.`
      }
    ],
    quiz: {
      title: 'React Fundamentals Assessment',
      instructions: 'Answer all 6 multiple-choice questions. A score of 70% or higher is required to pass.',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          questionText: 'What is the primary role of the Virtual DOM in React?',
          options: [
            'Directly replace the browser DOM entirely on each click',
            'Compute minimal DOM diffs in memory before batch updating the real DOM',
            'Render server-side HTML without JavaScript execution',
            'Provide database querying capabilities inside the browser'
          ],
          correctAnswerIndex: 1,
          explanation: 'The Virtual DOM allows React to compute changes in an in-memory tree (reconciliation) and batch apply only the necessary modifications to the real browser DOM.'
        },
        {
          questionText: 'Which statement about React state updates is correct?',
          options: [
            'State can be directly mutated using assignment operators like state.count = 5',
            'State updates are always strictly synchronous in all JavaScript contexts',
            'State should be treated as immutable, and functional updates should be used when relying on previous state',
            'useState cannot be used more than once inside a single component'
          ],
          correctAnswerIndex: 2,
          explanation: 'Treating state as immutable allows React to detect changes by reference and prevents unexpected side effects. Functional updates ensure correct calculations when batching.'
        },
        {
          questionText: 'When does a useEffect cleanup function run?',
          options: [
            'Only once when the browser tab closes',
            'Before the effect runs again and when the component unmounts',
            'Before the initial component mount',
            'Every time a prop is passed, even if the dependency did not change'
          ],
          correctAnswerIndex: 1,
          explanation: 'The cleanup function returned by useEffect runs right before the effect re-runs (if dependencies changed) and when the component unmounts from the DOM.'
        },
        {
          questionText: 'What naming convention must custom hooks follow in React?',
          options: [
            'Must end with the word Hook (e.g., fetchUserHook)',
            'Must start with the lowercase prefix "use" (e.g., useFetchUser)',
            'Must be written in all uppercase letters',
            'Must be declared inside class components only'
          ],
          correctAnswerIndex: 1,
          explanation: 'React relies on the "use" prefix to enforce the Rules of Hooks via linters and internal runtime checks.'
        },
        {
          questionText: 'Why is an empty dependency array [] used in useEffect?',
          options: [
            'To disable the effect permanently',
            'To run the effect after every single state change',
            'To run the effect only once after the initial render and clean up on unmount',
            'To prevent any JSX from rendering on screen'
          ],
          correctAnswerIndex: 2,
          explanation: 'An empty dependency array indicates that the effect does not depend on any props or state, so React runs it only once after the initial render.'
        },
        {
          questionText: 'What is a major advantage of Zustand compared to traditional Redux?',
          options: [
            'It requires enclosing the entire app in multiple nested Context Providers',
            'It provides minimal boilerplate, doesn’t require Context providers, and allows selective re-rendering',
            'It only works with class components',
            'It cannot handle asynchronous functions'
          ],
          correctAnswerIndex: 1,
          explanation: 'Zustand requires no provider wrapping, has negligible boilerplate, and re-renders only components subscribing to the specific slice of state.'
        }
      ]
    }
  },
  {
    title: 'Node.js Backend Development',
    slug: 'nodejs-backend-development',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedDuration: '5.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Build scalable RESTful APIs with Express, asynchronous I/O, middleware, JWT auth, and error handling.',
    description: 'Deep dive into server-side JavaScript using Node.js and Express. Learn how the non-blocking event loop operates, master the Express middleware pattern, design RESTful resources, implement secure JWT authentication with bcrypt password hashing, and structure enterprise-ready APIs with clean separation of concerns.',
    lessons: [
      {
        order: 1,
        title: 'Node.js Architecture & The Event Loop',
        duration: '25 mins',
        description: 'Understand single-threaded concurrency, the libuv thread pool, and non-blocking I/O.',
        content: `### How Node.js Works Under the Hood

Node.js executes JavaScript code using the Google V8 engine, backed by **libuv** for handling asynchronous I/O operations.

#### Single-Threaded Event Loop
JavaScript execution in Node.js is single-threaded. This means your code runs on one main execution thread, eliminating multi-threading concurrency issues like deadlocks.

\`\`\`
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
\`\`\`

#### Key Phases:
1. **Timers**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Poll**: Retrieves new I/O events and executes I/O-related callbacks.
3. **Check**: Executes callbacks invoked by \`setImmediate()\`.
4. **Close callbacks**: Executes socket close events (\`socket.on('close', ...)\`).`
      },
      {
        order: 2,
        title: 'Express.js Routing & Middleware Patterns',
        duration: '30 mins',
        description: 'Create modular routers and understand how Express middleware chains process requests.',
        content: `### Building with Express Middleware

In Express, an application is essentially a stack of middleware functions. Middleware functions have access to the request object (\`req\`), response object (\`res\`), and the \`next\` function in the application’s request-response cycle.

\`\`\`javascript
const express = require('express');
const router = express.Router();

// Custom logging & timing middleware
const requestTimer = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`[\${req.method}] \${req.originalUrl} - \${duration}ms\`);
  });
  next(); // Pass control to the next middleware in the chain
};

router.use(requestTimer);
\`\`\`

#### Types of Middleware:
- **Application-level middleware**: Bound to an instance of \`express()\`.
- **Router-level middleware**: Bound to an instance of \`express.Router()\`.
- **Error-handling middleware**: Takes 4 parameters: \`(err, req, res, next)\`.
- **Third-party middleware**: E.g., \`cors\`, \`helmet\`, \`morgan\`.`
      },
      {
        order: 3,
        title: 'JWT Authentication & Password Hashing',
        duration: '35 mins',
        description: 'Implement token-based authentication with bcrypt hashing and JWT token verification.',
        content: `### Securing REST APIs with JSON Web Tokens

Stateful session cookies require centralized session storage in multi-instance architectures. **JSON Web Tokens (JWT)** provide a stateless authentication mechanism where the user's identity is securely signed in a cryptographic payload.

\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. Password Hashing with Salt
async function hashUserPassword(rawPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(rawPassword, salt);
}

// 2. Token Generation
function createAccessToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
\`\`\`

#### Anatomy of a JWT:
A token consists of three parts separated by dots:
1. **Header**: Algorithm and token type (\`HS256\`).
2. **Payload**: User claims (e.g., user ID, issue time, expiration).
3. **Signature**: Cryptographic HMAC-SHA256 signature calculated with the secret key.`
      },
      {
        order: 4,
        title: 'RESTful API Design & Status Codes',
        duration: '25 mins',
        description: 'Design uniform resource endpoints adhering to industry REST conventions.',
        content: `### REST Architectural Constraints

REST (Representational State Transfer) structures APIs around resources identified by URIs and manipulated using standard HTTP verbs:

| Verb | Endpoint | Purpose | Standard Status |
| --- | --- | --- | --- |
| \`GET\` | \`/api/courses\` | Retrieve list | 200 OK |
| \`GET\` | \`/api/courses/:id\` | Retrieve single item | 200 OK / 404 Not Found |
| \`POST\` | \`/api/courses\` | Create new resource | 201 Created |
| \`PUT\` / \`PATCH\` | \`/api/courses/:id\` | Update resource | 200 OK |
| \`DELETE\` | \`/api/courses/:id\` | Remove resource | 200 OK or 204 No Content |

#### Handling Errors Gracefully:
Always return a consistent JSON schema across both successful responses and error scenarios.`
      },
      {
        order: 5,
        title: 'Centralized Error Handling Architecture',
        duration: '30 mins',
        description: 'Build robust asynchronous error interceptors that prevent server crashes.',
        content: `### Production Error Handling in Express

Uncaught exceptions or unhandled promise rejections can crash a Node.js process. Implement centralized error-handling middleware at the very end of your middleware pipeline:

\`\`\`javascript
// Centralized Error Middleware (must have 4 arguments)
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
\`\`\`

#### Best Practices:
- Always forward unexpected async errors with \`next(err)\` or use an \`asyncHandler\` wrapper.
- Never leak sensitive database credentials or raw stack traces in production.`
      }
    ],
    quiz: {
      title: 'Node.js & Express Architecture Quiz',
      instructions: 'Test your understanding of asynchronous runtime execution, REST principles, and security.',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          questionText: 'Which library handles asynchronous non-blocking I/O operations for Node.js?',
          options: [
            'libuv',
            'jQuery',
            'Babel',
            'Webpack'
          ],
          correctAnswerIndex: 0,
          explanation: 'libuv is the multi-platform C library that powers the Node.js event loop and asynchronous thread pool.'
        },
        {
          questionText: 'How does Express identify an error-handling middleware function?',
          options: [
            'By placing it at the very top of app.js',
            'By accepting exactly 4 parameters: (err, req, res, next)',
            'By returning a Promise instead of calling next()',
            'By naming the function "catchError"'
          ],
          correctAnswerIndex: 1,
          explanation: 'Express inspects function arity (length); a middleware function with 4 arguments (err, req, res, next) is treated as an error handler.'
        },
        {
          questionText: 'Why should passwords be salted before hashing with bcrypt?',
          options: [
            'To speed up CPU hashing times',
            'To prevent rainbow table attacks by ensuring identical passwords yield distinct hashes',
            'To convert the password to a base64 string for easy database storage',
            'To allow decrypting the password back to plain text when needed'
          ],
          correctAnswerIndex: 1,
          explanation: 'Salting introduces unique pseudo-random entropy to each hash, preventing attackers from using precomputed rainbow tables.'
        },
        {
          questionText: 'What HTTP status code should be returned when a client requests a resource that does not exist?',
          options: [
            '400 Bad Request',
            '401 Unauthorized',
            '404 Not Found',
            '500 Server Error'
          ],
          correctAnswerIndex: 2,
          explanation: '404 Not Found indicates that the origin server did not find a current representation for the target resource.'
        },
        {
          questionText: 'What are the three components of a JSON Web Token (JWT)?',
          options: [
            'Header, Payload, and Signature',
            'Username, Password, and Domain',
            'Query, Params, and Body',
            'Key, Certificate, and Authority'
          ],
          correctAnswerIndex: 0,
          explanation: 'A JWT is composed of a Header (algorithm metadata), Payload (claims), and Signature (cryptographic verification).'
        },
        {
          questionText: 'What happens if next() is neither called nor a response sent in an Express middleware?',
          options: [
            'The request completes successfully automatically',
            'The client request hangs indefinitely until a timeout occurs',
            'The server immediately shuts down',
            'Express skips to the next route automatically'
          ],
          correctAnswerIndex: 1,
          explanation: 'Express relies on calling next() or ending the response with res.send/json. Without either, the HTTP connection remains open until client or socket timeout.'
        }
      ]
    }
  },
  {
    title: 'JavaScript Advanced Concepts',
    slug: 'javascript-advanced-concepts',
    category: 'Frontend',
    difficulty: 'Advanced',
    estimatedDuration: '4 hours',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Deep dive into closures, prototypes, event loop microtasks vs macrotasks, generators, and memory management.',
    description: 'Elevate your JavaScript expertise beyond basic syntax. Explore lexical scoping, memory allocation, prototype chains, ES6 proxies, and the nuanced distinction between microtasks and macrotasks. Gain the deep language knowledge expected of senior software engineers.',
    lessons: [
      {
        order: 1,
        title: 'Closures & Lexical Scoping',
        duration: '25 mins',
        description: 'Understand how execution contexts retain references to outer scope variables.',
        content: `### Deep Dive: Lexical Scope and Closures

A **closure** is the combination of a function bundled together (enclosed) with references to its surrounding state (the **lexical environment**).

#### How Closures Work
In JavaScript, functions form closures every time a function is created:

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Private state retained in closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counterA = createCounter(10);
console.log(counterA.increment()); // 11
console.log(counterA.getValue());  // 11
\`\`\`

#### Practical Applications:
- **Data Encapsulation**: Creating private variables without ES private class fields.
- **Currying and Partial Application**: Pre-configuring functions with fixed parameters.
- **Event Handler factories**: Retaining component context across async listeners.`
      },
      {
        order: 2,
        title: 'Prototypes, Classes & Prototype Chaining',
        duration: '25 mins',
        description: 'Explore prototypal inheritance and how JavaScript implements object delegation.',
        content: `### Prototypal Inheritance vs Class Syntactic Sugar

Unlike classical class-based languages (like Java or C++), JavaScript implements inheritance via **object delegation**:

\`\`\`javascript
const animal = {
  makeSound() {
    return \`\${this.name} makes a sound.\`;
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.bark = function() { return 'Woof!'; };

console.log(dog.makeSound()); // Rex makes a sound.
\`\`\`

#### The \`prototype\` Property:
Every JavaScript constructor function has a \`prototype\` property, and instances created with \`new\` have an internal \`[[Prototype]]\` link (accessible via \`Object.getPrototypeOf()\`).`
      },
      {
        order: 3,
        title: 'Event Loop: Microtasks vs Macrotasks',
        duration: '30 mins',
        description: 'Demystify Promise resolution, process.nextTick, setTimeout, and queue prioritization.',
        content: `### Task Queues and Scheduling

The JavaScript runtime prioritizes tasks across different queues:

1. **Call Stack**: Executes synchronous code line-by-line.
2. **Microtask Queue**: Promises (\`.then\`, \`.catch\`, \`async/await\`), \`queueMicrotask()\`, and Node's \`process.nextTick()\`.
3. **Macrotask Queue (Task Queue)**: \`setTimeout\`, \`setInterval\`, I/O operations, UI rendering.

\`\`\`javascript
console.log('1: Sync');

setTimeout(() => {
  console.log('4: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('2: Microtask (Promise)');
});

queueMicrotask(() => {
  console.log('3: Microtask (queueMicrotask)');
});

// Output Order:
// 1: Sync
// 2: Microtask (Promise)
// 3: Microtask (queueMicrotask)
// 4: Macrotask (setTimeout)
\`\`\`

**Rule**: All microtasks in the microtask queue must be completely drained before the engine picks the next macrotask!`
      },
      {
        order: 4,
        title: 'Memory Leaks & Garbage Collection',
        duration: '25 mins',
        description: 'Understand Mark-and-Sweep garbage collection, retainers, and memory leak patterns.',
        content: `### JavaScript Memory Management

JavaScript manages memory automatically using **Garbage Collection (GC)** based primarily on the **Mark-and-Sweep** algorithm.

#### Common Sources of Memory Leaks:
1. **Uncleared Timers & Intervals**: Holding references to outer scope variables.
2. **Dangling DOM Event Listeners**: Listening to elements that have been removed from the DOM.
3. **Accidental Global Variables**: Omitting \`let\`/\`const\` in non-strict mode.
4. **Unbounded Caches**: Storing growing data in closures or global objects without LRU eviction.`
      }
    ],
    quiz: {
      title: 'Advanced JavaScript Mastery Quiz',
      instructions: 'Evaluate your understanding of JavaScript internals and runtime execution.',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          questionText: 'What is a closure in JavaScript?',
          options: [
            'A syntax error that occurs when a curly bracket is left unclosed',
            'A function that retains access to variables from its outer lexical scope even after that scope has finished executing',
            'A method that immediately halts the JavaScript runtime',
            'A built-in data structure similar to a Map'
          ],
          correctAnswerIndex: 1,
          explanation: 'A closure is created when a function accesses variables from its enclosing lexical environment, preserving them in memory.'
        },
        {
          questionText: 'In what order does the JavaScript runtime drain the queues?',
          options: [
            'Macrotasks are always executed before any Microtasks',
            'The entire Microtask queue is drained before the next Macrotask is processed',
            'Timers and Promises run simultaneously on two parallel OS threads',
            'DOM events take precedence over synchronous call stack execution'
          ],
          correctAnswerIndex: 1,
          explanation: 'Whenever the call stack is empty, the engine exhausts all pending microtasks before executing the next macrotask.'
        },
        {
          questionText: 'Which algorithm is predominantly used by modern JavaScript engines for Garbage Collection?',
          options: [
            'Reference Counting exclusively',
            'Mark-and-Sweep',
            'FIFO Deletion',
            'Round-Robin Eviction'
          ],
          correctAnswerIndex: 1,
          explanation: 'Modern engines use Mark-and-Sweep (and generational GC) to identify objects unreachable from root references, effectively handling circular references.'
        },
        {
          questionText: 'What does Object.create(proto) do?',
          options: [
            'Creates a deep clone of the proto object',
            'Creates a new object with its internal [[Prototype]] set to proto',
            'Freezes proto so its properties cannot be changed',
            'Converts proto into a JSON string'
          ],
          correctAnswerIndex: 1,
          explanation: 'Object.create creates a new empty object whose prototype is set to the specified prototype object.'
        },
        {
          questionText: 'Which of the following creates a microtask in a standard browser environment?',
          options: [
            'setTimeout(() => {}, 0)',
            'setInterval(() => {}, 100)',
            'Promise.resolve().then(() => {})',
            'requestAnimationFrame(() => {})'
          ],
          correctAnswerIndex: 2,
          explanation: 'Promise resolution callbacks (.then/.catch/finally) are queued in the microtask queue.'
        }
      ]
    }
  },
  {
    title: 'MongoDB Essentials',
    slug: 'mongodb-essentials',
    category: 'Database',
    difficulty: 'Beginner',
    estimatedDuration: '3.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Master NoSQL document modeling, Mongoose schemas, compound indexes, and aggregation pipelines.',
    description: 'Learn how to build high-performance data layers using MongoDB and Mongoose. Master document modeling tradeoffs (embedding vs referencing), index strategies, compound indexing for multi-key queries, and complex data analysis with the Aggregation Pipeline.',
    lessons: [
      {
        order: 1,
        title: 'Document Modeling: Embedding vs Referencing',
        duration: '25 mins',
        description: 'Architect flexible schemas by deciding when to embed subdocuments or use references.',
        content: `### NoSQL Schema Design Principles

MongoDB stores data as BSON (Binary JSON) documents. Designing MongoDB schemas requires choosing between two fundamental relationship patterns:

#### 1. Embedding (Denormalization)
Place related data inside a single document:

\`\`\`json
{
  "_id": "course123",
  "title": "MongoDB Essentials",
  "lessons": [
    { "order": 1, "title": "Document Modeling" },
    { "order": 2, "title": "Indexing" }
  ]
}
\`\`\`
- **When to use**: 1-to-few relationships, data that is almost always read together, atomic update requirements.

#### 2. Referencing (Normalized)
Store ObjectIds and link across collections:

\`\`\`json
{
  "_id": "quizRes456",
  "userId": "user789",
  "courseId": "course123",
  "score": 90
}
\`\`\`
- **When to use**: 1-to-many or many-to-many relationships, unbounded growth arrays, independent lifecycle entities.`
      },
      {
        order: 2,
        title: 'Mongoose ODM Schemas & Middleware',
        duration: '30 mins',
        description: 'Define strong types, validation constraints, virtuals, and pre/post hooks.',
        content: `### Modeling Data with Mongoose

Mongoose provides an elegant schema-based solution to model your application data, including validation, casting, query building, and business logic hooks.

\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  }
}, { timestamps: true });

// Pre-save hook example
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // hash password logic
  }
  next();
});
\`\`\`

#### Key Features:
- **Validators**: Built-in (\`required\`, \`min\`, \`max\`, \`enum\`) and custom validator functions.
- **Virtuals**: Properties that you can get and set but do not persist to MongoDB.`
      },
      {
        order: 3,
        title: 'Indexing & Performance Optimization',
        duration: '25 mins',
        description: 'Boost query throughput from collection scans (COLLSCAN) to indexed scans (IXSCAN).',
        content: `### Speeding Up Queries with Indexes

Without indexes, MongoDB must scan every document in a collection (**COLLSCAN**) to select those that match the query statement.

#### Creating Compound Indexes:
Compound indexes support queries on multiple fields:

\`\`\`javascript
// Index user queries by userId and courseId
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
\`\`\`

#### The Equality, Sort, Range (ESR) Rule:
When designing compound indexes:
1. **E**quality: Fields queried for exact matches first.
2. **S**ort: Fields used for ordering results next.
3. **R**ange: Fields queried with \`$gt\`, \`$lt\`, or \`$in\` last.`
      },
      {
        order: 4,
        title: 'Aggregation Framework Deep Dive',
        duration: '30 mins',
        description: 'Transform, group, filter, and analyze documents through aggregation stages.',
        content: `### The MongoDB Aggregation Pipeline

Aggregation operations process multiple documents and return computed results, functioning similarly to an assembly line:

\`\`\`javascript
const stats = await QuizResult.aggregate([
  // Stage 1: Filter by course
  { $match: { courseId: courseObjectId } },
  
  // Stage 2: Group and calculate metrics
  {
    $group: {
      _id: '$courseId',
      averageScore: { $avg: '$percentage' },
      totalAttempts: { $sum: 1 },
      highestScore: { $max: '$percentage' }
    }
  }
]);
\`\`\`

#### Common Stages:
- \`$match\`: Filters documents.
- \`$group\`: Groups documents by a specified identifier and accumulates values.
- \`$project\`: Reshapes document fields.
- \`$sort\`: Orders documents.`
      }
    ],
    quiz: {
      title: 'MongoDB & Mongoose Mastery Quiz',
      instructions: 'Demonstrate your knowledge of schema design, indexing, and aggregation in MongoDB.',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          questionText: 'When is embedding data preferred over referencing in MongoDB?',
          options: [
            'When data has an unbounded 1-to-millions relationship',
            'When data is frequently read together in a 1-to-few relationship',
            'When data must be queried across completely unrelated tenants',
            'Only when storing binary image files'
          ],
          correctAnswerIndex: 1,
          explanation: 'Embedding is ideal for 1-to-few relationships where documents are regularly retrieved together in single read operations.'
        },
        {
          questionText: 'What query plan execution type indicates an unindexed query scanning every document?',
          options: [
            'IXSCAN',
            'COLLSCAN',
            'SHARD_MERGE',
            'FETCH'
          ],
          correctAnswerIndex: 1,
          explanation: 'COLLSCAN stands for Collection Scan, indicating MongoDB had to read every document in the collection because no suitable index was present.'
        },
        {
          questionText: 'What is the recommended rule of thumb for ordering fields in a compound index?',
          options: [
            'Alphabetical order only',
            'Range, Sort, Equality (RSE)',
            'Equality, Sort, Range (ESR)',
            'Random based on insertion timestamp'
          ],
          correctAnswerIndex: 2,
          explanation: 'The ESR (Equality, Sort, Range) rule ensures compound indexes are leveraged with maximum efficiency.'
        },
        {
          questionText: 'Which aggregation stage is used to filter incoming documents?',
          options: [
            '$filter',
            '$where',
            '$match',
            '$select'
          ],
          correctAnswerIndex: 2,
          explanation: 'The $match pipeline stage filters documents according to specified MongoDB query conditions.'
        },
        {
          questionText: 'What does a unique compound index { userId: 1, courseId: 1 } ensure?',
          options: [
            'Users can only take one course in their lifetime',
            'No two documents can share the exact same combination of userId and courseId',
            'The collection is automatically deleted if a duplicate is found',
            'Only one user can exist in the database'
          ],
          correctAnswerIndex: 1,
          explanation: 'A unique compound index guarantees uniqueness across the combined tuple of specified fields, preventing duplicate progress records.'
        }
      ]
    }
  },
  {
    title: 'AI & LLM Fundamentals',
    slug: 'ai-llm-fundamentals',
    category: 'AI & Data',
    difficulty: 'Intermediate',
    estimatedDuration: '4.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Understand Large Language Models, prompt engineering, embeddings, RAG architectures, and AI agent systems.',
    description: 'Demystify the architecture and application of modern Artificial Intelligence and Large Language Models (LLMs). Understand transformers, self-attention mechanisms, prompt engineering frameworks, vector embeddings, semantic search, and Retrieval-Augmented Generation (RAG) pipelines.',
    lessons: [
      {
        order: 1,
        title: 'Transformer Architecture & Self-Attention',
        duration: '30 mins',
        description: 'Explore the breakthrough mechanics behind GPT, Gemini, and modern generative AI.',
        content: `### The Foundation of Modern LLMs

Introduced in the landmark 2017 paper *"Attention Is All You Need"*, the **Transformer** architecture replaced recurrent neural networks (RNNs) with parallelized **Self-Attention** mechanisms.

#### Why Self-Attention Matters
Traditional models processed text sequentially, losing long-distance context. Self-attention allows every token in a sequence to calculate attention weights with every other token concurrently:

\`\`\`
Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V
\`\`\`

- **Queries (Q)**: What the current token is looking for.
- **Keys (K)**: What other tokens offer.
- **Values (V)**: The semantic content of the tokens.`
      },
      {
        order: 2,
        title: 'Prompt Engineering & System Directives',
        duration: '25 mins',
        description: 'Master few-shot prompting, chain-of-thought reasoning, and structured output formatting.',
        content: `### Designing High-Accuracy Prompts

Prompt engineering is the empirical craft of guiding LLMs toward reliable, reproducible outputs.

#### Core Prompting Techniques:
1. **Few-Shot Prompting**: Providing 2-3 exemplar input-output pairs to calibrate tone and formatting.
2. **Chain-of-Thought (CoT)**: Instructing the model to *"Think step-by-step"* before producing a final answer, dramatically improving reasoning and multi-step math capabilities.
3. **Role & Constraint Framing**: Explicitly setting the persona, target audience, and output schema (e.g., valid JSON).`
      },
      {
        order: 3,
        title: 'Vector Embeddings & Semantic Search',
        duration: '25 mins',
        description: 'Convert unstructured text into high-dimensional vectors for similarity calculation.',
        content: `### High-Dimensional Vector Embeddings

An **embedding** is a vector representation of data (such as words, sentences, or images) where semantically similar items reside close to one another in high-dimensional vector space.

#### Cosine Similarity
Distance between two vectors $A$ and $B$ is measured using cosine similarity:

\`\`\`
CosineSimilarity = (A · B) / (||A|| * ||B||)
\`\`\`

Values range from -1 (opposite) to 1 (identical meaning). Unlike exact keyword matching, semantic search understands synonyms and conceptual intent.`
      },
      {
        order: 4,
        title: 'Retrieval-Augmented Generation (RAG)',
        duration: '30 mins',
        description: 'Connect LLMs to private knowledge bases to eliminate hallucinations and outdated facts.',
        content: `### Building RAG Architectures

LLMs possess static knowledge bounded by their training cutoff. **Retrieval-Augmented Generation (RAG)** injects real-time, domain-specific external context into the prompt:

\`\`\`
User Query ──> Embed Query ──> Vector DB Search ──> Relevant Chunks
                                                          │
LLM Response <── LLM Prompt (Query + Retrieved Chunks) <──┘
\`\`\`

#### Benefits of RAG:
- Reduces hallucination by grounding responses in verified sources.
- Avoids the expensive computational cost of fine-tuning models.
- Allows access control and real-time updates to knowledge.`
      }
    ],
    quiz: {
      title: 'AI & LLM Fundamentals Quiz',
      instructions: 'Demonstrate your comprehension of generative AI, transformers, embeddings, and RAG.',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          questionText: 'What breakthrough mechanism enabled the Transformer model to supersede RNNs?',
          options: [
            'Strict single-token sequential processing',
            'Self-Attention mechanism allowing parallelized context calculation',
            'Hardcoded grammatical dictionary lookup',
            'Relational database foreign keys'
          ],
          correctAnswerIndex: 1,
          explanation: 'Self-attention allows the model to score relationships between all tokens simultaneously without sequential bottlenecks.'
        },
        {
          questionText: 'What is the primary benefit of Chain-of-Thought (CoT) prompting?',
          options: [
            'It forces the model to respond in binary code',
            'It encourages the model to break down complex reasoning into intermediate steps before concluding',
            'It decreases the token count of the prompt',
            'It automatically fine-tunes the model weights'
          ],
          correctAnswerIndex: 1,
          explanation: 'Chain-of-thought prompting prompts the model to articulate reasoning steps, reducing logic leaps and hallucinations.'
        },
        {
          questionText: 'What is a vector embedding in machine learning?',
          options: [
            'A cryptographic hash like MD5',
            'A dense numerical array representing semantic meaning in vector space',
            'An SQL table with rows and columns',
            'A compressed JPEG image'
          ],
          correctAnswerIndex: 1,
          explanation: 'An embedding maps text into a multi-dimensional mathematical vector capturing semantic relationships.'
        },
        {
          questionText: 'What does RAG stand for in modern AI engineering?',
          options: [
            'Recursive Automated Generation',
            'Retrieval-Augmented Generation',
            'Random Access Gradient',
            'Real-time Artificial Generalization'
          ],
          correctAnswerIndex: 1,
          explanation: 'Retrieval-Augmented Generation combines external database retrieval with generative LLM synthesis.'
        },
        {
          questionText: 'Why is RAG frequently preferred over full model fine-tuning for domain knowledge updates?',
          options: [
            'Fine-tuning requires rewriting the entire model from scratch in C++',
            'RAG provides instant updates without retraining costs and directly cites retrieved context',
            'RAG completely removes the need for an LLM',
            'Fine-tuning cannot be used with English text'
          ],
          correctAnswerIndex: 1,
          explanation: 'RAG is vastly cheaper, faster to update dynamically, and allows explicit attribution to proprietary source documents.'
        }
      ]
    }
  },
  {
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    category: 'Full-Stack',
    difficulty: 'Advanced',
    estimatedDuration: '6 hours',
    thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Build end-to-end production web apps combining React frontends, Node/Express APIs, MongoDB, and CI/CD.',
    description: 'Connect the entire web application ecosystem. Learn how to architect end-to-end systems that integrate responsive client-side React frontends with resilient Express backends and MongoDB databases. Master authentication flows, API contract design, deployment workflows, and performance monitoring.',
    lessons: [
      {
        order: 1,
        title: 'Client-Server Communication & API Contracts',
        duration: '30 mins',
        description: 'Design robust JSON contracts, Axios interceptors, and CORS policies.',
        content: `### Connecting Frontend Clients to Backend APIs

Building reliable full-stack applications requires robust HTTP communication contracts between the client and server.

#### Axios Interceptor Patterns:
Using Axios interceptors allows seamless injection of authentication credentials and centralized handling of expired sessions:

\`\`\`javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor: attach bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('learnflow_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('learnflow_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
\`\`\``
      },
      {
        order: 2,
        title: 'End-to-End Authentication Architecture',
        duration: '35 mins',
        description: 'Coordinate protected routes, JWT persistence, and synchronized user session state.',
        content: `### Synchronizing Auth State Across the Stack

A secure authentication flow requires both client and server working in harmony:

1. **User Registers / Logs In**: Frontend dispatches credentials to backend.
2. **Backend Validates**: Compares bcrypt hash and generates signed JWT.
3. **Client Stores Token**: Stores in localStorage or httpOnly cookie, and initializes global Zustand auth store.
4. **Protected Routes**: React Router checks auth state and redirects unauthenticated visitors to \`/login\`.
5. **Session Hydration**: On app refresh, \`GET /api/auth/me\` verifies token validity and restores user profile.`
      },
      {
        order: 3,
        title: 'Optimistic UI Updates & Error Rollbacks',
        duration: '25 mins',
        description: 'Deliver instant perceived responsiveness while guaranteeing backend data integrity.',
        content: `### Optimistic UI Patterns

Rather than showing a loading spinner for every minor user action, optimistic UI immediately renders the anticipated successful state and reconciles or rolls back if the network request fails:

\`\`\`javascript
const handleToggle = async (lessonId) => {
  // 1. Snapshot previous state
  const previousState = completedLessons;
  
  // 2. Immediately update local state
  setCompletedLessons((prev) => [...prev, lessonId]);

  try {
    // 3. Dispatch network request
    await progressApi.completeLesson(courseId, lessonId);
  } catch (err) {
    // 4. Rollback on failure & inform user
    setCompletedLessons(previousState);
    toast.error('Failed to save progress. Please try again.');
  }
};
\`\`\``
      },
      {
        order: 4,
        title: 'Production Deployment & Security Hardening',
        duration: '30 mins',
        description: 'Prepare applications for production with environment isolation, HTTPS, and headers.',
        content: `### Hardening the Full-Stack Application

Moving from local development to production requires critical hardening:

- **Environment Variables**: Never hardcode database connection strings, JWT secrets, or API URLs.
- **HTTP Security Headers**: Use Helmet middleware in Express to set CSP, HSTS, and X-Frame-Options.
- **Rate Limiting**: Prevent brute-force login attacks with rate limiters.
- **CORS Protection**: Restrict cross-origin resource sharing strictly to approved frontend domains.`
      }
    ],
    quiz: {
      title: 'Full-Stack Architecture Assessment',
      instructions: 'Validate your understanding of end-to-end full-stack integration and security.',
      timeLimitMinutes: 10,
      passingScore: 70,
      questions: [
        {
          questionText: 'What is the purpose of an Axios response interceptor for 401 status codes?',
          options: [
            'To automatically clear invalid tokens and redirect unauthenticated users to login',
            'To retry the failed request 100 times in a loop',
            'To format all data as XML instead of JSON',
            'To shut down the backend Express server'
          ],
          correctAnswerIndex: 0,
          explanation: 'A 401 response interceptor catches expired or invalid token responses globally, clearing expired credentials and redirecting to login.'
        },
        {
          questionText: 'What is the primary advantage of Optimistic UI updates?',
          options: [
            'It guarantees the server never has to process the request',
            'It provides instantaneous user feedback, making the application feel snappy and responsive',
            'It replaces database backups completely',
            'It prevents all network errors from occurring'
          ],
          correctAnswerIndex: 1,
          explanation: 'Optimistic UI updates immediately reflect the expected change on screen, improving perceived performance while handling rollbacks if an error occurs.'
        },
        {
          questionText: 'Why should sensitive secrets like JWT_SECRET and MONGODB_URI never be included in frontend bundles?',
          options: [
            'Frontend bundles are sent to the user’s browser where anyone can inspect the source code',
            'React cannot read strings longer than 10 characters',
            'Browsers will refuse to run JavaScript that contains database strings',
            'It causes Vite to crash during build time'
          ],
          correctAnswerIndex: 0,
          explanation: 'All frontend code is publicly accessible and easily decompiled in the browser. Database credentials and signing secrets must remain strictly on the backend.'
        },
        {
          questionText: 'What does Cross-Origin Resource Sharing (CORS) govern?',
          options: [
            'How many users can access a database simultaneously',
            'Which domains are permitted by the browser to make cross-origin requests to an API',
            'The speed at which images load from CDNs',
            'The color palette applied by CSS stylesheets'
          ],
          correctAnswerIndex: 1,
          explanation: 'CORS is a browser security mechanism that controls whether web pages from one origin can make HTTP requests to a different origin.'
        },
        {
          questionText: 'How is user session persistence typically achieved across browser refreshes in modern SPAs?',
          options: [
            'By storing a JWT token in localStorage or cookie and validating it on app mount via a /me endpoint',
            'By asking the user to type their password on every page click',
            'By storing the database directly in the browser cache',
            'By keeping a WebSocket connection open permanently 24/7'
          ],
          correctAnswerIndex: 0,
          explanation: 'The application stores the signed token and verifies it upon initial app load by querying the authenticated user profile (/api/auth/me).'
        }
      ]
    }
  }
];

module.exports = { coursesData };
