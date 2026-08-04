import { Question, SkillCategory } from '../types';

export const QUESTION_BANK: Record<SkillCategory, Question[]> = {
  'Frontend (React/JS)': [
    {
      id: 'react-1',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Hooks & State',
      question: 'What is the primary purpose of the useCallback hook in React?',
      options: [
        'To memoize the calculated return value of a expensive function',
        'To memoize a callback function instance between renders to prevent unnecessary child re-renders',
        'To perform side effects synchronously after every DOM modification',
        'To automatically bind methods to the component instance'
      ],
      correctAnswer: 1,
      explanation: 'useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed, preventing re-creations of functions passed to optimized child components.'
    },
    {
      id: 'react-2',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Virtual DOM',
      question: 'How does React\'s reconciliation process determine if a component needs to be re-rendered?',
      options: [
        'By directly comparing the old real DOM node with the new real DOM node in memory',
        'By comparing the new Virtual DOM tree with the previous Virtual DOM tree using a heuristic O(n) diffing algorithm',
        'By inspecting the browser\'s layout recalculation log',
        'By executing all event listeners on every frame'
      ],
      correctAnswer: 1,
      explanation: 'React uses a heuristic O(n) diffing algorithm comparing element types, keys, and props between current and fiber trees.'
    },
    {
      id: 'react-3',
      category: 'Frontend (React/JS)',
      skillName: 'JavaScript Core',
      topic: 'Event Loop',
      question: 'In JavaScript\'s event loop, what is the order of execution between Microtasks and Macrotasks?',
      options: [
        'Macrotasks are always processed before any Microtask',
        'Microtask queue is fully drained before taking the next task from the Macrotask queue',
        'They are executed strictly alternately one-by-one',
        'Microtasks are deferred until the browser repaints'
      ],
      correctAnswer: 1,
      explanation: 'After a task finishes, the engine executes ALL available microtasks (Promises, process.nextTick, queueMicrotask) before picking the next macrotask (setTimeout, setInterval).'
    },
    {
      id: 'react-4',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Hooks & Lifecycle',
      question: 'When does the cleanup function returned inside useEffect run?',
      options: [
        'Only when the component mounts',
        'Before the component unmounts and before re-running the effect on subsequent renders if dependencies change',
        'Immediately before the browser repaints the screen',
        'At the start of every render phase before JSX evaluation'
      ],
      correctAnswer: 1,
      explanation: 'React executes the cleanup function prior to running the effect again on prop updates, and when the component unmounts.'
    },
    {
      id: 'react-5',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Performance',
      question: 'What is the correct usage of React.memo?',
      options: [
        'To cache state variables inside functional components',
        'To wrap functional components and skip rendering when props have not changed (shallow comparison)',
        'To force a component to re-render when global context changes',
        'To automatically split code into separate bundles at build time'
      ],
      correctAnswer: 1,
      explanation: 'React.memo is a higher order component that memoizes functional components based on shallow prop comparisons.'
    },
    {
      id: 'react-6',
      category: 'Frontend (React/JS)',
      skillName: 'JavaScript Core',
      topic: 'Closures',
      question: 'What happens when a function inside React useEffect captures a state variable without specifying it in the dependency array?',
      options: [
        'React throws a runtime SyntaxError',
        'The function encounters a stale closure and accesses the state value from the render when the effect was created',
        'React automatically updates the dependency array at runtime',
        'The variable becomes undefined after the initial render'
      ],
      correctAnswer: 1,
      explanation: 'Missing dependencies lead to stale closures where inner functions retain references to outer scope variables frozen at render time.'
    },
    {
      id: 'react-7',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Concurrent React',
      question: 'What does the useTransition hook in React 18 enable?',
      options: [
        'CSS keyframe animations for route switches',
        'Marking state updates as non-urgent transitions so heavy renders don\'t block user interactions like typing',
        'Automatic server-side rendering fallback',
        'Synchronous DOM layout reads'
      ],
      correctAnswer: 1,
      explanation: 'useTransition lets you mark updates as transitions, allowing React to interrupt low-priority updates for high-priority user input.'
    },
    {
      id: 'react-8',
      category: 'Frontend (React/JS)',
      skillName: 'CSS & Layout',
      topic: 'Tailwind & Flexbox',
      question: 'Which Tailwind CSS class combination centers an element horizontally and vertically inside a full-height flex container?',
      options: [
        'flex h-screen items-center justify-center',
        'block mx-auto my-auto h-full',
        'grid col-span-2 text-center h-screen',
        'flex content-stretch flex-col'
      ],
      correctAnswer: 0,
      explanation: 'flex h-screen sets flex layout and viewport height, while items-center and justify-center align along cross and main axes.'
    },
    {
      id: 'react-9',
      category: 'Frontend (React/JS)',
      skillName: 'TypeScript',
      topic: 'Generics',
      question: 'In TypeScript, what does the keyword `extends` signify in `<T extends keyof U>`?',
      options: [
        'Inheritance of class methods only',
        'A generic constraint requiring T to be a valid property key of type U',
        'An explicit type alias conversion',
        'A runtime assertion check'
      ],
      correctAnswer: 1,
      explanation: 'generic constraints limit the allowable types passed to T to keys existing on U.'
    },
    {
      id: 'react-10',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Context API',
      question: 'What is a major potential performance pitfall of using a single large React Context for all app state?',
      options: [
        'Context values cannot hold arrays or objects',
        'Every component consuming the context re-renders whenever ANY property in the context value changes, regardless of whether it uses that property',
        'Context causes memory leaks in modern browsers',
        'Context disables server-side rendering'
      ],
      correctAnswer: 1,
      explanation: 'All Context consumers re-render when the context value reference changes, making monolithic context objects inefficient for frequent updates.'
    },
    {
      id: 'react-11',
      category: 'Frontend (React/JS)',
      skillName: 'JavaScript Core',
      topic: 'Promises & Async',
      question: 'What is the result of executing Promise.all([p1, p2, p3]) if p2 rejects?',
      options: [
        'It returns an array containing the results of p1 and p3, ignoring p2',
        'The entire Promise.all immediately rejects with p2\'s reason (fail-fast behavior)',
        'It waits for p1 and p3 to complete before throwing an error',
        'It automatically retries p2 three times'
      ],
      correctAnswer: 1,
      explanation: 'Promise.all rejects immediately upon the first rejected promise in the input array.'
    },
    {
      id: 'react-12',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Custom Hooks',
      question: 'What rule MUST custom React hooks follow to maintain state consistency?',
      options: [
        'Must always return an array with exactly two elements',
        'Must start with the "use" prefix and only call other Hooks at the top level (never inside loops, conditions, or nested functions)',
        'Must be declared as class static methods',
        'Must be registered in package.json'
      ],
      correctAnswer: 1,
      explanation: 'React relies on call order for Hook state retention; calling hooks inside conditionals breaks internal hook indices.'
    },
    {
      id: 'react-13',
      category: 'Frontend (React/JS)',
      skillName: 'Web APIs',
      topic: 'DOM Operations',
      question: 'What is event delegation in JavaScript?',
      options: [
        'Passing an event listener as a prop to a child component',
        'Attaching a single event listener to a parent element to handle events on descendant elements via event bubbling',
        'Preventing default browser actions using event.preventDefault()',
        'Offloading heavy click handlers to a Web Worker'
      ],
      correctAnswer: 1,
      explanation: 'Event delegation leverages bubbling by placing a listener higher in the DOM tree, handling events for present or future descendants.'
    },
    {
      id: 'react-14',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Keys & Lists',
      question: 'Why should array indices generally be avoided as `key` props when rendering dynamic lists in React?',
      options: [
        'Indices cause TypeScript compilation errors',
        'Reordering or deleting items can lead to component state mismatches and incorrect DOM re-use',
        'Indices consume extra memory in the browser',
        'React strips numerical keys automatically'
      ],
      correctAnswer: 1,
      explanation: 'When item order changes, index keys confuse React diffing, causing components to retain wrong local state or DOM nodes.'
    },
    {
      id: 'react-15',
      category: 'Frontend (React/JS)',
      skillName: 'State Management',
      topic: 'Zustand / Redux',
      question: 'In Redux Toolkit / Immer, why are direct state mutations allowed inside reducers?',
      options: [
        'Because Redux completely disables immutability checks',
        'Because Immer wraps state in a draft proxy and produces a new immutable state tree automatically behind the scenes',
        'Because modern JS engines support mutable atomic state',
        'Because reducers run inside Web Workers'
      ],
      correctAnswer: 1,
      explanation: 'Immer uses Proxy objects to detect modifications to a draft state and produce a copy with changes applied immutably.'
    },
    {
      id: 'react-16',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Ref & DOM',
      question: 'What is the primary difference between useRef and useState?',
      options: [
        'useRef values trigger a re-render when mutated; useState values do not',
        'Mutating a ref object\'s .current property does NOT trigger a component re-render, whereas state setters trigger re-renders',
        'useRef can only store HTML DOM elements',
        'useState retains data across page reloads'
      ],
      correctAnswer: 1,
      explanation: 'useRef creates a mutable container whose modification is silent with respect to component render cycles.'
    },
    {
      id: 'react-17',
      category: 'Frontend (React/JS)',
      skillName: 'Web Security',
      topic: 'XSS Prevention',
      question: 'How does JSX naturally protect applications against Cross-Site Scripting (XSS)?',
      options: [
        'By executing all strings in a sandboxed iframe',
        'By automatically escaping all values embedded in JSX expressions prior to rendering them as DOM text nodes',
        'By rejecting string inputs containing HTML tags at compile time',
        'By encrypting component state'
      ],
      correctAnswer: 1,
      explanation: 'React converts all embedded expressions into safe strings by escaping HTML characters, avoiding script injection unless dangerouslySetInnerHTML is used.'
    },
    {
      id: 'react-18',
      category: 'Frontend (React/JS)',
      skillName: 'Performance',
      topic: 'Code Splitting',
      question: 'How do you lazy-load a React component for dynamic route code splitting?',
      options: [
        'Using const Component = React.lazy(() => import(\'./Component\')) wrapped in a Suspense boundary',
        'Using import SyncComponent from \'./Component\'',
        'Wrapping the component in React.memo with a 500ms delay',
        'Setting loading="lazy" on the component tag'
      ],
      correctAnswer: 0,
      explanation: 'React.lazy accepts a dynamic import() function returning a promise, requiring a Suspense component to show fallback UI.'
    },
    {
      id: 'react-19',
      category: 'Frontend (React/JS)',
      skillName: 'TypeScript',
      topic: 'Utility Types',
      question: 'Which TypeScript utility type creates a type with all properties of T set to optional?',
      options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Omit<T, keyof T>'],
      correctAnswer: 1,
      explanation: 'Partial<T> returns a type where every key of T is marked with the optional modifier ?.'
    },
    {
      id: 'react-20',
      category: 'Frontend (React/JS)',
      skillName: 'React.js',
      topic: 'Error Boundaries',
      question: 'Which lifecycle method or hook is required to create a React Error Boundary?',
      options: [
        'useErrorHandler hook',
        'Class component with static getDerivedStateFromError or componentDidCatch',
        'useEffect with a try-catch block',
        'React.memo with error handler callback'
      ],
      correctAnswer: 1,
      explanation: 'Error boundaries currently must be class components implementing getDerivedStateFromError or componentDidCatch.'
    }
  ],

  'Backend (Node/Express)': [
    {
      id: 'node-1',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Architecture',
      question: 'What handles non-blocking I/O operations and thread pooling in Node.js underlying runtime?',
      options: [
        'V8 Engine directly',
        'libuv library',
        'Express router module',
        'npm package manager'
      ],
      correctAnswer: 1,
      explanation: 'libuv is the multi-platform C library that provides Node.js with asynchronous I/O abstractions, event loop, and a default 4-thread pool.'
    },
    {
      id: 'node-2',
      category: 'Backend (Node/Express)',
      skillName: 'Express.js',
      topic: 'Middleware',
      question: 'What happens if an Express middleware function does NOT call next() or send a response (res.send/json)?',
      options: [
        'Express throws an UnhandledPromiseRejection warning',
        'The HTTP request hangs indefinitely until a client/server timeout occurs',
        'The server automatically forwards to the 404 handler',
        'Node.js process terminates immediately'
      ],
      correctAnswer: 1,
      explanation: 'Express middleware requires invoking next() to pass control to the next handler or calling a response method to close the HTTP socket.'
    },
    {
      id: 'node-3',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Streams',
      question: 'Why are Streams preferred over fs.readFile when handling large multi-gigabyte file downloads?',
      options: [
        'Streams automatically encrypt file content on disk',
        'Streams process data in chunks without buffering the entire file into RAM, keeping memory footprint low',
        'Streams run faster because they bypass the V8 garbage collector',
        'fs.readFile is restricted to files under 100KB'
      ],
      correctAnswer: 1,
      explanation: 'Streams read and stream data sequentially in buffers, preventing Node.js process out-of-memory errors.'
    },
    {
      id: 'node-4',
      category: 'Backend (Node/Express)',
      skillName: 'REST API',
      topic: 'HTTP Methods',
      question: 'According to REST conventions, what is the key difference between PUT and PATCH methods?',
      options: [
        'PUT is asynchronous; PATCH is synchronous',
        'PUT replaces the target resource entirely with the request payload; PATCH applies partial modifications',
        'PUT is used for querying; PATCH is used for creation',
        'PATCH requires SSL encryption; PUT does not'
      ],
      correctAnswer: 1,
      explanation: 'PUT is idempotent and replaces the entire resource representation, while PATCH modifies specific attributes.'
    },
    {
      id: 'node-5',
      category: 'Backend (Node/Express)',
      skillName: 'Security',
      topic: 'JWT & Auth',
      question: 'Where is the safest place to store a JSON Web Token (JWT) in a web browser to prevent XSS attacks?',
      options: [
        'localStorage',
        'An HttpOnly, Secure, SameSite cookie',
        'sessionStorage',
        'Global JavaScript variable window.jwtToken'
      ],
      correctAnswer: 1,
      explanation: 'HttpOnly cookies cannot be read by browser JavaScript scripts, mitigating token theft via XSS vulnerabilities.'
    },
    {
      id: 'node-6',
      category: 'Backend (Node/Express)',
      skillName: 'Express.js',
      topic: 'Error Handling',
      question: 'How does Express identify a specialized error-handling middleware function?',
      options: [
        'By decorating it with @ErrorHandler',
        'By declaring exactly four arguments: (err, req, res, next)',
        'By placing it at the top of the middleware stack',
        'By returning an instance of Error'
      ],
      correctAnswer: 1,
      explanation: 'Express inspects function.length and recognizes 4 parameters as the signature for error-handling middleware.'
    },
    {
      id: 'node-7',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Event Loop',
      question: 'Which Node.js method schedules a callback to run in the Check phase immediately after I/O polling?',
      options: [
        'process.nextTick()',
        'setImmediate()',
        'setTimeout(fn, 0)',
        'queueMicrotask()'
      ],
      correctAnswer: 1,
      explanation: 'setImmediate callbacks execute during the "check" phase of the event loop cycle right after I/O callbacks.'
    },
    {
      id: 'node-8',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Process & Clusters',
      question: 'What does the Node.js `cluster` module do?',
      options: [
        'Clusters multiple database queries into one transaction',
        'Forks multiple worker processes sharing the same server port to utilize multi-core CPU architectures',
        'Compresses static files before streaming',
        'Clusters Redis instances for failover'
      ],
      correctAnswer: 1,
      explanation: 'The cluster module creates child processes (workers) that run simultaneously and share TCP connections, bypassing single-core V8 limits.'
    },
    {
      id: 'node-9',
      category: 'Backend (Node/Express)',
      skillName: 'Security',
      topic: 'CORS',
      question: 'What causes a browser to send an HTTP OPTIONS "preflight" request prior to an actual API request?',
      options: [
        'Any GET request with query parameters',
        'Cross-origin requests using methods like POST/PUT/DELETE with custom headers or non-standard Content-Types (e.g. application/json)',
        'When the response payload exceeds 1MB',
        'When using HTTPS on localhost'
      ],
      correctAnswer: 1,
      explanation: 'Browsers send preflight OPTIONS requests to check CORS permissions when requests fall outside simple request criteria.'
    },
    {
      id: 'node-10',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'EventEmitter',
      question: 'What happens if an EventEmitter in Node.js emits an \'error\' event and no listener is attached?',
      options: [
        'The error is logged silently to stdout',
        'The Node.js process crashes with an uncaughtException',
        'It retries emitting the event 3 times',
        'The event is queued for 1 minute'
      ],
      correctAnswer: 1,
      explanation: 'When an EventEmitter emits "error" without handlers, Node.js treats it as an unhandled error and terminates the process.'
    },
    {
      id: 'node-11',
      category: 'Backend (Node/Express)',
      skillName: 'API Design',
      topic: 'Rate Limiting',
      question: 'Which HTTP status code should a backend server return when a client exceeds rate limits?',
      options: ['400 Bad Request', '401 Unauthorized', '429 Too Many Requests', '503 Service Unavailable'],
      correctAnswer: 2,
      explanation: '429 Too Many Requests indicates the user has sent too many requests in a given amount of time (rate limiting).'
    },
    {
      id: 'node-12',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Modules (ESM vs CJS)',
      question: 'In Node.js ES Modules (.mjs / "type": "module"), which CJS global is unavailable natively?',
      options: ['console', 'process', '__dirname', 'Buffer'],
      correctAnswer: 2,
      explanation: '__dirname and __filename are CommonJS scope variables and are not present in native ES modules.'
    },
    {
      id: 'node-13',
      category: 'Backend (Node/Express)',
      skillName: 'Security',
      topic: 'Injection Attacks',
      question: 'How do parameterised/prepared SQL queries prevent SQL Injection?',
      options: [
        'By stripping all quotes from incoming strings',
        'By treating user input strictly as literal values rather than executable SQL code instructions during query parsing',
        'By encoding database responses in Base64',
        'By hashing database table names'
      ],
      correctAnswer: 1,
      explanation: 'Parameterized queries compile the query structure first, keeping parameter data distinctly separated from code execution parsing.'
    },
    {
      id: 'node-14',
      category: 'Backend (Node/Express)',
      skillName: 'Express.js',
      topic: 'Routing',
      question: 'In Express path matching, how do you capture a named parameter from URL path `/users/:id`?',
      options: ['req.body.id', 'req.params.id', 'req.query.id', 'req.headers.id'],
      correctAnswer: 1,
      explanation: 'Route parameters specified with :paramName are accessible on the req.params object.'
    },
    {
      id: 'node-15',
      category: 'Backend (Node/Express)',
      skillName: 'Performance',
      topic: 'Compression',
      question: 'What middleware module is commonly used in Express to compress HTTP response bodies (Gzip/Brotli)?',
      options: ['helmet', 'compression', 'morgan', 'cors'],
      correctAnswer: 1,
      explanation: 'The compression middleware compresses response payloads to reduce network bandwidth.'
    },
    {
      id: 'node-16',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Worker Threads',
      question: 'When should worker_threads be used instead of standard asynchronous I/O callbacks in Node.js?',
      options: [
        'For high-frequency database read operations',
        'For CPU-intensive tasks like image processing, encryption, or heavy calculations',
        'For serving static HTML pages',
        'For managing WebSocket connections'
      ],
      correctAnswer: 1,
      explanation: 'Worker threads run JavaScript in parallel on isolated threads, preventing CPU-bound tasks from blocking the main event loop.'
    },
    {
      id: 'node-17',
      category: 'Backend (Node/Express)',
      skillName: 'Security',
      topic: 'HTTP Headers',
      question: 'What security functionality does the `helmet` package provide for Express applications?',
      options: [
        'Encrypts all incoming POST payloads',
        'Sets appropriate HTTP response headers (e.g., Content-Security-Policy, X-Content-Type-Options) to secure the app',
        'Protects against DDoS attacks automatically',
        'Manages user password hashing with bcrypt'
      ],
      correctAnswer: 1,
      explanation: 'Helmet sets security-related HTTP headers to protect Express apps from common vulnerabilities like clickjacking and MIME sniffing.'
    },
    {
      id: 'node-18',
      category: 'Backend (Node/Express)',
      skillName: 'Node.js',
      topic: 'Memory Management',
      question: 'Which tool or process parameter can inspect memory leaks in a running Node.js production server?',
      options: [
        'npm run lint',
        'Generating a heap dump via v8.getHeapSnapshot() or node --inspect and analyzing in Chrome DevTools',
        'Checking package.json dependencies',
        'Reading res.headersSent'
      ],
      correctAnswer: 1,
      explanation: 'V8 heap snapshots record memory allocation profiles to identify uncollected objects and memory leaks.'
    },
    {
      id: 'node-19',
      category: 'Backend (Node/Express)',
      skillName: 'Caching',
      topic: 'Redis',
      question: 'In a distributed backend microservice architecture, why is Redis often used for session storage?',
      options: [
        'Redis is an append-only file system with zero memory usage',
        'Redis stores key-value data in RAM with sub-millisecond latency, allowing any load-balanced server instance to validate user sessions',
        'Redis automatically compiles JS code to C++',
        'Redis replaces Express router modules'
      ],
      correctAnswer: 1,
      explanation: 'In-memory speed and centralized key-value capabilities make Redis ideal for shared, stateless server cluster sessions.'
    },
    {
      id: 'node-20',
      category: 'Backend (Node/Express)',
      skillName: 'WebSockets',
      topic: 'Realtime Protocol',
      question: 'How does the initial connection handshaking work for WebSockets (ws://)?',
      options: [
        'It starts as a standard HTTP/1.1 request containing "Upgrade: websocket" headers, then switches protocols upon HTTP 101 response',
        'It uses UDP datagrams exclusively from the start',
        'It opens a direct TLS raw socket bypassing HTTP',
        'It sends continuous POST requests every 100ms'
      ],
      correctAnswer: 0,
      explanation: 'WebSockets initiate with an HTTP Upgrade request, switching the established TCP socket to WebSocket protocol after a 101 response.'
    }
  ],

  'AI/ML (Python/PyTorch)': [
    {
      id: 'aiml-1',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Machine Learning',
      topic: 'Model Training',
      question: 'What is overfitting in machine learning models?',
      options: [
        'When a model performs poorly on both training and test data',
        'When a model learns noisy details and specific training data patterns so well that it fails to generalize to new, unseen data',
        'When the learning rate is too low during gradient descent',
        'When the dataset contains missing values'
      ],
      correctAnswer: 1,
      explanation: 'Overfitting occurs when a model fits training data too closely, capturing noise and yielding high variance on test validation sets.'
    },
    {
      id: 'aiml-2',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Deep Learning',
      topic: 'Transformers & Attention',
      question: 'What is the mathematical core innovation of the Transformer architecture introduced in "Attention Is All You Need"?',
      options: [
        'Recurrent highway connections across time steps',
        'Scaled Dot-Product Self-Attention mechanism allowing parallel computation across input sequences',
        '3D Convolutional filters with max pooling',
        'Genetic algorithm optimization'
      ],
      correctAnswer: 1,
      explanation: 'Self-attention calculates pairwise token relationships simultaneously across the full sequence without sequential RNN constraints.'
    },
    {
      id: 'aiml-3',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'PyTorch',
      topic: 'Autograd',
      question: 'In PyTorch, what does calling `loss.backward()` perform?',
      options: [
        'Resets all model weights to random initial values',
        'Computes the gradients of the loss with respect to all graph tensors that have `requires_grad=True` via automatic differentiation',
        'Updates the optimizer learning rate schedule',
        'Clears GPU memory buffers'
      ],
      correctAnswer: 1,
      explanation: 'loss.backward() traverses the computational graph backwards, calculating partial derivatives (gradients) stored in tensor.grad.'
    },
    {
      id: 'aiml-4',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Evaluation Metrics',
      topic: 'Classification',
      question: 'Which evaluation metric is preferred over accuracy when evaluating a highly imbalanced dataset (e.g. 99% negative, 1% positive)?',
      options: ['Mean Squared Error (MSE)', 'Accuracy Score', 'F1-Score / Area Under Precision-Recall Curve (PR-AUC)', 'R-squared'],
      correctAnswer: 2,
      explanation: 'Accuracy is misleading on imbalanced data because a naive model predicting all negatives achieves 99% accuracy; F1-score balances precision and recall.'
    },
    {
      id: 'aiml-5',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'PyTorch',
      topic: 'Optimizer',
      question: 'Why do we call `optimizer.zero_grad()` before computing `loss.backward()` in a PyTorch training loop?',
      options: [
        'Because PyTorch accumulates gradients by default on backward calls, so old gradients must be cleared before the new step',
        'To reset the GPU cache memory',
        'To prevent vanishing gradients',
        'To normalize the output probabilities'
      ],
      correctAnswer: 0,
      explanation: 'PyTorch gradient buffers accumulate rather than overwrite, requiring zero_grad() before each backward pass.'
    },
    {
      id: 'aiml-6',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Deep Learning',
      topic: 'Activation Functions',
      question: 'What advantage does ReLU (Rectified Linear Unit) have over Sigmoid activation functions in deep networks?',
      options: [
        'ReLU bounds outputs strictly between -1 and +1',
        'ReLU mitigates the vanishing gradient problem for positive inputs because its derivative is a constant 1',
        'ReLU requires complex exponential calculations',
        'ReLU prevents dying neurons under all circumstances'
      ],
      correctAnswer: 1,
      explanation: 'Sigmoid saturates at large absolute values causing near-zero gradients; ReLU keeps constant gradient=1 for positive inputs.'
    },
    {
      id: 'aiml-7',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'LLMs & GenAI',
      topic: 'RAG',
      question: 'What does RAG stand for in modern Generative AI architecture?',
      options: [
        'Recurrent Agent Generator',
        'Retrieval-Augmented Generation',
        'Randomized Attention Graph',
        'Recursive Alignment Gradient'
      ],
      correctAnswer: 1,
      explanation: 'Retrieval-Augmented Generation enhances LLM prompts with relevant retrieved knowledge chunks from external vector databases.'
    },
    {
      id: 'aiml-8',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Python Data Science',
      topic: 'NumPy / Vectorization',
      question: 'Why is vectorization in NumPy significantly faster than standard Python `for` loops?',
      options: [
        'NumPy uses dynamic type casting at runtime',
        'NumPy operations execute in optimized contiguous C memory arrays without Python interpreter overhead',
        'NumPy disables CPU cache checks',
        'NumPy compiles code into JavaScript'
      ],
      correctAnswer: 1,
      explanation: 'NumPy arrays store homogenous data in continuous memory blocks and execute low-level C SIMD instruction sets.'
    },
    {
      id: 'aiml-9',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Deep Learning',
      topic: 'Regularization',
      question: 'How does Dropout act as a regularization technique during training?',
      options: [
        'By dropping negative loss values',
        'By randomly setting a percentage of neuron activation outputs to zero during each training step, preventing feature co-adaptation',
        'By reducing the size of training mini-batches',
        'By clipping learning rate spikes'
      ],
      correctAnswer: 1,
      explanation: 'Dropout forces a neural network to learn redundant representations by randomly zeroing activations during forward passes.'
    },
    {
      id: 'aiml-10',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'LLMs & GenAI',
      topic: 'Fine-Tuning',
      question: 'What is LoRA (Low-Rank Adaptation) used for in Large Language Model fine-tuning?',
      options: [
        'Loss Reduction Algorithm',
        'Freezing original pretrained weights and injecting trainable rank decomposition matrices, reducing trainable parameter count by 99%+',
        'Compressing 16-bit floats into 1-bit integers',
        'Generating synthetic training prompts'
      ],
      correctAnswer: 1,
      explanation: 'LoRA freezes base weights and updates low-rank parameter matrices, drastically reducing GPU memory needs for fine-tuning.'
    },
    {
      id: 'aiml-11',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Optimization',
      topic: 'Gradient Descent',
      question: 'What happens if the learning rate parameter in Gradient Descent is set excessively high?',
      options: [
        'The model converges to the global minimum almost instantly',
        'The loss function may oscillate wildly or diverge, overshooting the local minimum',
        'Gradients become exactly zero',
        'The model enters an infinite loop'
      ],
      correctAnswer: 1,
      explanation: 'An overly large learning rate causes big step sizes that bounce over optimal parameters and cause loss to explode.'
    },
    {
      id: 'aiml-12',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'PyTorch',
      topic: 'Model Evaluation',
      question: 'What does `model.eval()` do in PyTorch?',
      options: [
        'Executes the model inside a web browser',
        'Sets the model into evaluation mode, altering behavior of layers like Dropout (disabled) and BatchNorm (uses running stats)',
        'Automatically exports the model to ONNX format',
        'Permanently freezes tensor gradients'
      ],
      correctAnswer: 1,
      explanation: 'model.eval() disables dropout and switches batch norm to use accumulated running statistics during inference.'
    },
    {
      id: 'aiml-13',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Computer Vision',
      topic: 'CNNs',
      question: 'What is the primary role of Pooling layers (e.g. MaxPool2d) in Convolutional Neural Networks?',
      options: [
        'To add non-linear activations',
        'To reduce spatial dimensions (height & width) of feature maps while retaining dominant features, reducing spatial parameter size',
        'To convert 2D images to 1D audio waves',
        'To normalize pixel RGB values to [0,1]'
      ],
      correctAnswer: 1,
      explanation: 'Max pooling downsamples spatial feature dimensions, providing translation invariance and computational efficiency.'
    },
    {
      id: 'aiml-14',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'NLP',
      topic: 'Embeddings',
      question: 'What is a text embedding in vector space?',
      options: [
        'An HTML code tag embedding text',
        'A dense numerical vector representing semantic meaning, where contextually similar words/sentences lie close together in Euclidean/cosine space',
        'An alphabetical index of dictionary words',
        'A compressed ZIP file of text'
      ],
      correctAnswer: 1,
      explanation: 'Embeddings map text tokens to continuous dense vector representations capturing semantic relationships.'
    },
    {
      id: 'aiml-15',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Loss Functions',
      topic: 'Regression vs Classification',
      question: 'Which loss function is standard for multi-class classification tasks with softmax outputs?',
      options: ['Mean Absolute Error (MAE)', 'Categorical Cross-Entropy Loss', 'Huber Loss', 'Hinge Loss'],
      correctAnswer: 1,
      explanation: 'Cross-entropy penalizes divergence between predicted probability distributions and true one-hot target classes.'
    },
    {
      id: 'aiml-16',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'LLMs & GenAI',
      topic: 'Temperature Parameter',
      question: 'In LLM decoding sampling, what happens when you set `temperature` to 0.0?',
      options: [
        'The model becomes completely random',
        'The model performs greedy decoding, choosing the token with the highest probability deterministically every step',
        'The output length is limited to 0 words',
        'The API throws an invalid parameter error'
      ],
      correctAnswer: 1,
      explanation: 'Temperature=0 makes the probability distribution sharp, selecting the top prediction deterministically.'
    },
    {
      id: 'aiml-17',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Machine Learning',
      topic: 'Bias-Variance Tradeoff',
      question: 'A model with high bias and low variance is typically suffering from:',
      options: ['Overfitting', 'Underfitting', 'Data leakage', 'Perfect generalization'],
      correctAnswer: 1,
      explanation: 'High bias implies overly simplistic assumptions, failing to capture underlying trends (underfitting).'
    },
    {
      id: 'aiml-18',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'PyTorch',
      topic: 'No Grad Context',
      question: 'Why do we wrap PyTorch validation inference code inside `with torch.no_grad():`?',
      options: [
        'To speed up CPU execution by disabling GPU',
        'To turn off autograd engine calculations, saving memory and speeding up forward passes when no gradients are needed',
        'To automatically log metrics to TensorBoard',
        'To prevent model weights from saving to disk'
      ],
      correctAnswer: 1,
      explanation: 'torch.no_grad() disables gradient tracking buffers, reducing memory consumption during evaluation or testing.'
    },
    {
      id: 'aiml-19',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Data Preprocessing',
      topic: 'Normalization',
      question: 'Why is feature scaling (e.g., StandardScaler or MinMaxScaler) critical before training algorithms like SVMs or k-NN?',
      options: [
        'Scale-sensitive algorithms compute distance metrics (Euclidean); unscaled large range features would dominate distance calculations',
        'Unscaled features corrupt Python memory allocations',
        'Scaling converts categorical variables to strings',
        'Scaling is only needed for text datasets'
      ],
      correctAnswer: 0,
      explanation: 'Distance-based models (k-NN, SVM, Gradient Descent) perform poorly if one feature ranges 0-1 and another ranges 0-1,000,000.'
    },
    {
      id: 'aiml-20',
      category: 'AI/ML (Python/PyTorch)',
      skillName: 'Vector Databases',
      topic: 'Similarity Metrics',
      question: 'Which vector distance metric measures the cosine of the angle between two embedding vectors regardless of magnitude?',
      options: ['Euclidean Distance (L2)', 'Cosine Similarity', 'Manhattan Distance (L1)', 'Hamming Distance'],
      correctAnswer: 1,
      explanation: 'Cosine similarity measures directional alignment of vectors, normalized for length.'
    }
  ],

  'UI/UX Design': [
    {
      id: 'uiux-1',
      category: 'UI/UX Design',
      skillName: 'UX Principles',
      topic: 'Fitts\'s Law',
      question: 'What does Fitts\'s Law state regarding user interface design?',
      options: [
        'Users spend most of their time on other sites, so your site should work similarly',
        'The time required to rapidly move to a target area is a function of the distance to the target and the target\'s size',
        'The average human memory can hold 7 ± 2 items in working memory',
        'Complexity in any system has a minimum threshold that cannot be reduced'
      ],
      correctAnswer: 1,
      explanation: 'Fitts\'s Law dictates that larger and closer touch/click targets are faster and easier for users to hit.'
    },
    {
      id: 'uiux-2',
      category: 'UI/UX Design',
      skillName: 'Accessibility',
      topic: 'WCAG Contrast',
      question: 'According to WCAG 2.1 AA standards, what is the minimum required color contrast ratio for normal body text?',
      options: ['2.5:1', '3.0:1', '4.5:1', '7.0:1'],
      correctAnswer: 2,
      explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text (under 18pt regular or 14pt bold).'
    },
    {
      id: 'uiux-3',
      category: 'UI/UX Design',
      skillName: 'Design Systems',
      topic: 'Typography & Hierarchy',
      question: 'What is the primary goal of creating a typographic scale in a digital design system?',
      options: [
        'To use as many font families as possible on a single screen',
        'To establish clear visual hierarchy, scannability, and mathematical rhythm across components',
        'To reduce CSS file bundle size',
        'To prevent font licensing issues'
      ],
      correctAnswer: 1,
      explanation: 'A typographic scale creates harmonic font sizes that guide user attention through structured hierarchy.'
    },
    {
      id: 'uiux-4',
      category: 'UI/UX Design',
      skillName: 'UX Methods',
      topic: 'Heuristic Evaluation',
      question: 'What is Jakob Nielsen\'s heuristic "Visibility of System Status"?',
      options: [
        'The app must display the user\'s IP address on the dashboard',
        'The system should always keep users informed about what is going on through appropriate feedback within a reasonable time',
        'Users must see all system source code',
        'The header bar must stay visible on scroll'
      ],
      correctAnswer: 1,
      explanation: 'Systems should give clear immediate feedback (e.g., loading spinners, success toasts) so users know current status.'
    },
    {
      id: 'uiux-5',
      category: 'UI/UX Design',
      skillName: 'UI Engineering',
      topic: 'Spacing & Grids',
      question: 'Why is the 8pt spatial grid system widely adopted in UI design?',
      options: [
        'Because 8 is a prime number',
        'Most screen display resolutions are divisible by 8, enabling crisp alignment and consistent spacing ratios across design and code',
        'Figma only supports 8px grids',
        'HTML default font size is 8px'
      ],
      correctAnswer: 1,
      explanation: '8px increments align cleanly with standard device display scaling factors (1x, 2x, 3x) and standard box models.'
    },
    {
      id: 'uiux-6',
      category: 'UI/UX Design',
      skillName: 'User Research',
      topic: 'Information Architecture',
      question: 'What is Card Sorting used for during UX research?',
      options: [
        'To design physical playing cards for gamification',
        'To understand how users categorize and structure content to inform navigation and site architecture',
        'To test button color preferences',
        'To calculate user page load speed'
      ],
      correctAnswer: 1,
      explanation: 'Card sorting reveals users\' mental models of domain topics to design intuitive navigation hierarchies.'
    },
    {
      id: 'uiux-7',
      category: 'UI/UX Design',
      skillName: 'UX Principles',
      topic: 'Hick\'s Law',
      question: 'What principle is derived from Hick\'s Law in UX design?',
      options: [
        'Increasing the number of choices increases decision-making time logarithmically',
        'Users prefer dark mode over light mode',
        'Animations should take less than 100 milliseconds',
        'Forms should always be single-column'
      ],
      correctAnswer: 0,
      explanation: 'Hick\'s Law shows that more choices lead to cognitive overload and slower user decisions.'
    },
    {
      id: 'uiux-8',
      category: 'UI/UX Design',
      skillName: 'Prototyping',
      topic: 'Figma & Components',
      question: 'In Figma / modern design tools, what is the purpose of Auto Layout?',
      options: [
        'To automatically generate React component code',
        'To build dynamic frames that expand or resize automatically based on content and padding rules (similar to Flexbox)',
        'To automatically color pick gradients',
        'To export SVGs to PNGs'
      ],
      correctAnswer: 1,
      explanation: 'Auto Layout mimics flexbox container behavior in UI tools, handling padding, alignment, and responsive flow.'
    },
    {
      id: 'uiux-9',
      category: 'UI/UX Design',
      skillName: 'Visual Design',
      topic: 'Color Theory',
      question: 'What is the 60-30-10 rule in UI color composition?',
      options: [
        '60% Red, 30% Green, 10% Blue',
        '60% Dominant neutral background, 30% Secondary structure/cards, 10% Vibrant accent color for primary actions/CTAs',
        '60% Opacity, 30% Saturation, 10% Brightness',
        '60% Text, 30% Images, 10% Whitespace'
      ],
      correctAnswer: 1,
      explanation: 'The 60-30-10 rule balances visual weight, guiding focus to accent call-to-actions without visual clutter.'
    },
    {
      id: 'uiux-10',
      category: 'UI/UX Design',
      skillName: 'Accessibility',
      topic: 'Focus States',
      question: 'Why should keyboard focus outlines (`:focus-visible`) never be completely removed without a visible alternative?',
      options: [
        'Because Google search ranks sites lower without CSS outlines',
        'Keyboard and screen reader users rely on focus outlines to navigate elements interactively',
        'Outlines speed up JavaScript execution',
        'Browser tab titles will break'
      ],
      correctAnswer: 1,
      explanation: 'Visible focus indicators are vital for motor-impaired or keyboard-only users to locate active interactive components.'
    },
    {
      id: 'uiux-11',
      category: 'UI/UX Design',
      skillName: 'Interaction Design',
      topic: 'Micro-interactions',
      question: 'What are the 4 essential parts of a UX micro-interaction according to Dan Saffer?',
      options: [
        'Input, Output, Process, Error',
        'Trigger, Rules, Feedback, Loops/Modes',
        'Design, Prototype, Test, Launch',
        'Click, Hover, Press, Release'
      ],
      correctAnswer: 1,
      explanation: 'Micro-interactions consist of Triggers (initiator), Rules (what happens), Feedback (visual/tactile response), and Loops/Modes.'
    },
    {
      id: 'uiux-12',
      category: 'UI/UX Design',
      skillName: 'User Research',
      topic: 'Usability Testing',
      question: 'What is the "Think Aloud" protocol during usability testing sessions?',
      options: [
        'The researcher shouts instructions loudly to the participant',
        'Participants continuously verbalize their thoughts, expectations, and confusion while completing assigned tasks',
        'The participant presents their feedback to a focus group',
        'AI analyzes user voice tone'
      ],
      correctAnswer: 1,
      explanation: 'Thinking aloud gives researchers qualitative insights into cognitive hurdles and user expectations in real time.'
    },
    {
      id: 'uiux-13',
      category: 'UI/UX Design',
      skillName: 'Visual Design',
      topic: 'Affordance vs Signifier',
      question: 'In Norman\'s Design of Everyday Things, what is a "signifier"?',
      options: [
        'The underlying mathematical code',
        'A perceivable indicator (like a button shadow or underline) that communicates what action is possible',
        'A brand logo in the header',
        'A legal disclaimer'
      ],
      correctAnswer: 1,
      explanation: 'Signifiers signal where an action should take place and how to interact with an element.'
    },
    {
      id: 'uiux-14',
      category: 'UI/UX Design',
      skillName: 'Design Systems',
      topic: 'Tokens',
      question: 'What are Design Tokens in UI engineering?',
      options: [
        'Cryptocurrency tokens for paying designers',
        'Platform-agnostic single sources of truth (JSON variables) storing visual design attributes like colors, typography, and spacing',
        'Security access tokens for API requests',
        'Figma plugin keys'
      ],
      correctAnswer: 1,
      explanation: 'Design tokens export raw values (hex codes, rem units) into iOS, Android, and Web stylesheets uniformly.'
    },
    {
      id: 'uiux-15',
      category: 'UI/UX Design',
      skillName: 'UX Patterns',
      topic: 'Dark Patterns',
      question: 'What constitutes a "Dark Pattern" (Deceptive Design) in UX design?',
      options: [
        'Using dark mode background colors',
        'Tricking or manipulating users into doing things they might not otherwise do (e.g. hidden recurring subscriptions)',
        'Designing interfaces without icons',
        'Using low contrast gray text'
      ],
      correctAnswer: 1,
      explanation: 'Deceptive patterns exploit cognitive biases to force accidental purchases, unwanted opt-ins, or hard cancellations.'
    },
    {
      id: 'uiux-16',
      category: 'UI/UX Design',
      skillName: 'Mobile UX',
      topic: 'Thumb Zone',
      question: 'Where should primary mobile actions be placed according to the Steven Hoober Thumb Zone study?',
      options: [
        'In the top right corner',
        'In the natural bottom-center arc reachable comfortably by a user\'s thumb during one-handed hold',
        'Inside a hamburger menu drawer',
        'At the exact geometric center'
      ],
      correctAnswer: 1,
      explanation: 'Bottom navigation bars sit directly within the low-effort thumb reach zone on handheld smartphones.'
    },
    {
      id: 'uiux-17',
      category: 'UI/UX Design',
      skillName: 'UI Animation',
      topic: 'Easing',
      question: 'Which easing curve feels most natural for elements entering the screen?',
      options: [
        'Linear (constant speed)',
        'Ease-out (starts fast, slows down smoothly as it reaches its final position)',
        'Ease-in (starts slow, accelerates abruptly at end)',
        'Step-end'
      ],
      correctAnswer: 1,
      explanation: 'Ease-out mimics real-world friction where incoming objects decelerate smoothly to a stop.'
    },
    {
      id: 'uiux-18',
      category: 'UI/UX Design',
      skillName: 'Visual Design',
      topic: 'Negative Space',
      question: 'What is the role of Negative Space (Whitespace) in UI layout design?',
      options: [
        'Wasted screen area that should be filled with ads or buttons',
        'A critical structural element that groups related content, creates breathing room, and improves legibility',
        'A CSS bug in older browsers',
        'An indicator of missing images'
      ],
      correctAnswer: 1,
      explanation: 'Negative space reduces cognitive noise, establishing visual groupings and premium aesthetic balance.'
    },
    {
      id: 'uiux-19',
      category: 'UI/UX Design',
      skillName: 'User Research',
      topic: 'Personas',
      question: 'What is a User Persona in UX strategy?',
      options: [
        'A fictitious job advertisement',
        'A semi-fictional representation of a key target user segment based on empirical research and user interviews',
        'An avatar chosen in an online game',
        'A celebrity brand ambassador'
      ],
      correctAnswer: 1,
      explanation: 'Personas ground product decisions in authentic user needs, goals, and behavioral patterns.'
    },
    {
      id: 'uiux-20',
      category: 'UI/UX Design',
      skillName: 'Information Architecture',
      topic: 'Breadcrumbs',
      question: 'When are Breadcrumbs most beneficial in web navigation?',
      options: [
        'On single-page apps with only 1 screen',
        'On deep multi-level hierarchical websites so users can track their location and navigate up categories easily',
        'In mobile hamburger menus',
        'Inside checkout payment forms'
      ],
      correctAnswer: 1,
      explanation: 'Breadcrumbs indicate hierarchical context, allowing quick 1-click upward navigation across nested sub-pages.'
    }
  ],

  'Data Structures & Algorithms': [
    {
      id: 'dsa-1',
      category: 'Data Structures & Algorithms',
      skillName: 'Algorithms',
      topic: 'Time Complexity',
      question: 'What is the average and worst-case time complexity of QuickSort?',
      options: [
        'Average O(N log N), Worst O(N²)',
        'Average O(N), Worst O(N log N)',
        'Average O(N²), Worst O(N³)',
        'Average O(log N), Worst O(N)'
      ],
      correctAnswer: 0,
      explanation: 'QuickSort averages O(N log N) with good pivots, but degrades to O(N²) if worst-case pivot selections occur continuously.'
    },
    {
      id: 'dsa-2',
      category: 'Data Structures & Algorithms',
      skillName: 'Data Structures',
      topic: 'Hash Tables',
      question: 'What is the expected average time complexity for insertion, deletion, and lookup in a Hash Map?',
      options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
      correctAnswer: 2,
      explanation: 'Good hash functions distribute keys evenly, yielding O(1) constant average time operations.'
    },
    {
      id: 'dsa-3',
      category: 'Data Structures & Algorithms',
      skillName: 'Graph Algorithms',
      topic: 'Dijkstra\'s Algorithm',
      question: 'What condition MUST hold for Dijkstra\'s shortest path algorithm to yield correct results?',
      options: [
        'The graph must be a binary search tree',
        'The graph must NOT contain negative edge weights',
        'All edges must have weight equal to 1',
        'The graph must be bipartite'
      ],
      correctAnswer: 1,
      explanation: 'Dijkstra assumes greedily visited nodes have finalized minimal distances; negative weights violate this assumption (requiring Bellman-Ford).'
    },
    {
      id: 'dsa-4',
      category: 'Data Structures & Algorithms',
      skillName: 'Trees',
      topic: 'Binary Search Tree',
      question: 'Which tree traversal order visits nodes of a Binary Search Tree in strictly sorted ascending order?',
      options: ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
      correctAnswer: 1,
      explanation: 'In-order traversal visits left subtree (< key), current node (= key), then right subtree (> key), resulting in sorted keys.'
    },
    {
      id: 'dsa-5',
      category: 'Data Structures & Algorithms',
      skillName: 'Dynamic Programming',
      topic: 'DP Fundamentals',
      question: 'What two key properties make a problem suitable for Dynamic Programming optimization?',
      options: [
        'Greedy choices and sorted inputs',
        'Optimal Substructure and Overlapping Subproblems',
        'Binary tree symmetry and constant memory',
        'Hash collisions and prime modulos'
      ],
      correctAnswer: 1,
      explanation: 'DP applies when solutions to subproblems can be memoized and reused to build global optimal solutions.'
    },
    {
      id: 'dsa-6',
      category: 'Data Structures & Algorithms',
      skillName: 'Data Structures',
      topic: 'Heaps & Priority Queue',
      question: 'What is the time complexity to insert a new element into a Min-Heap of size N?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctAnswer: 1,
      explanation: 'Insertion appends to the complete binary tree array and bubbles up (heapify-up) along the tree height log N.'
    },
    {
      id: 'dsa-7',
      category: 'Data Structures & Algorithms',
      skillName: 'Algorithms',
      topic: 'Two Pointers',
      question: 'In the classic 2-Sum problem on a SORTED array, how do two pointers move to find target sum K?',
      options: [
        'Both start at index 0 and move right',
        'One starts at index 0 (left) and one at N-1 (right); if sum < K increment left, if sum > K decrement right',
        'Pointers jump by power of 2 steps',
        'Pointers swap positions every iteration'
      ],
      correctAnswer: 1,
      explanation: 'Sorted order allows narrowing the search window in O(N) time without nested loops.'
    },
    {
      id: 'dsa-8',
      category: 'Data Structures & Algorithms',
      skillName: 'Data Structures',
      topic: 'Stack vs Queue',
      question: 'Which data structure enforces Last-In, First-Out (LIFO) order?',
      options: ['Queue', 'Stack', 'Linked List', 'Priority Queue'],
      correctAnswer: 1,
      explanation: 'Stack operates on LIFO principle (push & pop at top).'
    },
    {
      id: 'dsa-9',
      category: 'Data Structures & Algorithms',
      skillName: 'Graph Algorithms',
      topic: 'BFS vs DFS',
      question: 'Which graph traversal algorithm uses a Queue data structure and finds the shortest path in unweighted graphs?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Kruskal\'s Algorithm', 'Topological Sort'],
      correctAnswer: 1,
      explanation: 'BFS explores graph level by level using a Queue, guaranteeing shortest edge distance in unweighted graphs.'
    },
    {
      id: 'dsa-10',
      category: 'Data Structures & Algorithms',
      skillName: 'Algorithms',
      topic: 'Sliding Window',
      question: 'When is the Sliding Window technique most effective?',
      options: [
        'Finding shortest paths in weighted graphs',
        'Solving contiguous array/substring problems (e.g. maximum sum subarray of length K)',
        'In-order tree traversals',
        'Sorting linked lists'
      ],
      correctAnswer: 1,
      explanation: 'Sliding window converts O(N²) nested loops over contiguous ranges into O(N) linear operations.'
    },
    {
      id: 'dsa-11',
      category: 'Data Structures & Algorithms',
      skillName: 'Data Structures',
      topic: 'Trie',
      question: 'What is a Trie (Prefix Tree) data structure primarily optimized for?',
      options: [
        'Fast matrix multiplication',
        'Efficient string prefix search, autocomplete, and dictionary lookups in O(L) time where L is string length',
        'Sorting integer arrays in place',
        'Storing image pixel channels'
      ],
      correctAnswer: 1,
      explanation: 'Tries store shared character prefixes along node branches, enabling fast L-step word lookups.'
    },
    {
      id: 'dsa-12',
      category: 'Data Structures & Algorithms',
      skillName: 'Algorithms',
      topic: 'Binary Search',
      question: 'What is the worst-case space complexity of iterative Binary Search on an array?',
      options: ['O(N)', 'O(log N)', 'O(1)', 'O(N²)'],
      correctAnswer: 2,
      explanation: 'Iterative binary search uses constant O(1) auxiliary variables (low, high, mid).'
    },
    {
      id: 'dsa-13',
      category: 'Data Structures & Algorithms',
      skillName: 'Trees',
      topic: 'AVL & Red-Black Trees',
      question: 'Why are self-balancing BSTs (like Red-Black trees) preferred over standard BSTs in library implementations (e.g., std::map)?',
      options: [
        'They eliminate duplicate keys automatically',
        'They guarantee tree height remains bounded at O(log N), preventing degeneration into O(N) linked lists on sorted insertions',
        'They consume zero memory pointers',
        'They sort strings without ASCII comparison'
      ],
      correctAnswer: 1,
      explanation: 'Rotations maintain balanced height log N, avoiding degenerate linear search chains.'
    },
    {
      id: 'dsa-14',
      category: 'Data Structures & Algorithms',
      skillName: 'Graph Algorithms',
      topic: 'Topological Sort',
      question: 'Topological sorting can ONLY be performed on which type of graph?',
      options: [
        'Undirected Connected Graph',
        'Directed Acyclic Graph (DAG)',
        'Complete Bipartite Graph',
        'Cyclic Weighted Graph'
      ],
      correctAnswer: 1,
      explanation: 'Cycles create circular dependency deadlocks, so topological ordering requires a DAG.'
    },
    {
      id: 'dsa-15',
      category: 'Data Structures & Algorithms',
      skillName: 'Data Structures',
      topic: 'Disjoint Set (Union-Find)',
      question: 'With Path Compression and Rank optimization, what is the amortized time complexity per operation in Union-Find?',
      options: ['O(N)', 'O(log N)', 'Nearly O(1) amortized (inverse Ackermann function α(N))', 'O(N²)'],
      correctAnswer: 2,
      explanation: 'Path compression flattens tree depths during find operations, reducing amortized complexity to near O(1).'
    },
    {
      id: 'dsa-16',
      category: 'Data Structures & Algorithms',
      skillName: 'Algorithms',
      topic: 'Bit Manipulation',
      question: 'What does the bitwise expression `n & (n - 1)` evaluate to?',
      options: [
        'Doubles the value of n',
        'Clears the lowest set bit (rightmost 1-bit) in binary representation of n',
        'Inverts all bits of n',
        'Checks if n is odd'
      ],
      correctAnswer: 1,
      explanation: 'Subtracting 1 flips trailing zeros and the lowest set bit; bitwise AND clears that set bit (useful for power-of-two tests).'
    },
    {
      id: 'dsa-17',
      category: 'Data Structures & Algorithms',
      skillName: 'Data Structures',
      topic: 'Linked List',
      question: 'Floyd\'s Tortoise and Hare algorithm is used to detect:',
      options: [
        'Maximum element in a BST',
        'Cycles in a Linked List using fast and slow pointers',
        'Shortest path in a weighted graph',
        'String anagrams'
      ],
      correctAnswer: 1,
      explanation: 'Two pointers moving at speeds 1 and 2 will meet inside any cyclic loop in O(N) time and O(1) space.'
    },
    {
      id: 'dsa-18',
      category: 'Data Structures & Algorithms',
      skillName: 'Dynamic Programming',
      topic: '0/1 Knapsack',
      question: 'What is the time complexity of the 0/1 Knapsack dynamic programming solution with N items and capacity W?',
      options: ['O(2^N)', 'O(N * W) pseudo-polynomial', 'O(N log W)', 'O(N + W)'],
      correctAnswer: 1,
      explanation: 'DP table size is N x W, giving O(N * W) time and space complexity.'
    },
    {
      id: 'dsa-19',
      category: 'Data Structures & Algorithms',
      skillName: 'Sorting',
      topic: 'Stability in Sorting',
      question: 'What does it mean for a sorting algorithm to be "Stable"?',
      options: [
        'It never crashes when memory is full',
        'It preserves the relative input order of records with equal keys',
        'It runs in constant O(1) space',
        'It uses random pivot points'
      ],
      correctAnswer: 1,
      explanation: 'Stability ensures equal key elements retain their original relative positions after sorting.'
    },
    {
      id: 'dsa-20',
      category: 'Data Structures & Algorithms',
      skillName: 'Space Complexity',
      topic: 'Recursion Depth',
      question: 'What causes a `Maximum call stack size exceeded` (StackOverflow) error in recursive function calls?',
      options: [
        'Heap memory corruption',
        'Missing base termination condition causing infinite recursive stack frame allocations',
        'Running out of disk space',
        'Using global variables'
      ],
      correctAnswer: 1,
      explanation: 'Every recursive call pushes a new frame onto the call stack; missing base cases exhaust the stack frame limit.'
    }
  ],

  'Database Management (SQL)': [
    {
      id: 'db-1',
      category: 'Database Management (SQL)',
      skillName: 'SQL Core',
      topic: 'ACID Properties',
      question: 'What does the "I" in ACID database transaction properties stand for?',
      options: ['Indexing', 'Isolation', 'Integrity', 'Immutability'],
      correctAnswer: 1,
      explanation: 'Isolation ensures concurrent transaction execution results match sequential execution without uncommitted state leakage.'
    },
    {
      id: 'db-2',
      category: 'Database Management (SQL)',
      skillName: 'Database Indexing',
      topic: 'B-Tree Indexing',
      question: 'How does a B-Tree index speed up SELECT query filtering on indexed columns?',
      options: [
        'By compressing all text columns to 8-bit hashes',
        'By allowing the engine to traverse a balanced search tree in O(log N) time rather than performing a full table scan O(N)',
        'By caching the entire database table in RAM',
        'By deleting duplicate rows on read'
      ],
      correctAnswer: 1,
      explanation: 'B-Tree indexes maintain sorted pointer branches, drastically narrowing disk page reads to O(log N).'
    },
    {
      id: 'db-3',
      category: 'Database Management (SQL)',
      skillName: 'SQL Joins',
      topic: 'JOIN Types',
      question: 'Which SQL JOIN returns all rows from the left table and matching rows from the right table, with NULLs for unmatched right rows?',
      options: ['INNER JOIN', 'LEFT (OUTER) JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
      correctAnswer: 1,
      explanation: 'LEFT JOIN preserves every record from the left table, padding missing right table columns with NULL.'
    },
    {
      id: 'db-4',
      category: 'Database Management (SQL)',
      skillName: 'Database Design',
      topic: 'Normalization',
      question: 'A table is in Third Normal Form (3NF) if it is in 2NF and:',
      options: [
        'Contains no multi-valued attributes',
        'Contains no transitive dependencies (non-key columns depend ONLY on the primary key)',
        'All column values are strings',
        'Contains at least 3 indexes'
      ],
      correctAnswer: 1,
      explanation: '3NF requires that non-prime attributes depend non-transitively on the primary key ("the key, the whole key, and nothing but the key").'
    },
    {
      id: 'db-5',
      category: 'Database Management (SQL)',
      skillName: 'SQL Aggregations',
      topic: 'HAVING vs WHERE',
      question: 'When should the `HAVING` clause be used instead of `WHERE` in a SELECT query?',
      options: [
        'To filter rows before grouping',
        'To filter aggregated group results (e.g. HAVING COUNT(*) > 5) after GROUP BY execution',
        'To join multiple tables',
        'To order results descending'
      ],
      correctAnswer: 1,
      explanation: 'WHERE filters raw rows prior to aggregation; HAVING filters aggregated groups after GROUP BY.'
    },
    {
      id: 'db-6',
      category: 'Database Management (SQL)',
      skillName: 'Database Indexing',
      topic: 'Composite Index',
      question: 'Given a composite index on `(last_name, first_name)`, which query CANNOT utilize this index effectively?',
      options: [
        'WHERE last_name = \'Smith\' AND first_name = \'John\'',
        'WHERE last_name = \'Smith\'',
        'WHERE first_name = \'John\' (without last_name)',
        'WHERE last_name LIKE \'S%\''
      ],
      correctAnswer: 2,
      explanation: 'Composite B-Tree indexes follow left-to-right prefix matching; queries omitting the leftmost column (last_name) skip index lookup.'
    },
    {
      id: 'db-7',
      category: 'Database Management (SQL)',
      skillName: 'Transactions',
      topic: 'Isolation Levels',
      question: 'Which isolation level prevents Dirty Reads but allows Non-Repeatable Reads?',
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      correctAnswer: 1,
      explanation: 'Read Committed ensures queries only see committed data changes, but subsequent reads within the transaction may pick up modified commits.'
    },
    {
      id: 'db-8',
      category: 'Database Management (SQL)',
      skillName: 'PostgreSQL Features',
      topic: 'JSONB Data Type',
      question: 'Why is `JSONB` preferred over plain `JSON` text column types in PostgreSQL?',
      options: [
        'JSONB stores formatted raw text strings with white-space',
        'JSONB stores pre-parsed binary JSON supporting GIN indexing and fast key-value lookups',
        'JSONB limits document sizes to 100 bytes',
        'JSONB automatically encrypts fields with AES-256'
      ],
      correctAnswer: 1,
      explanation: 'JSONB parses payload into decomposed binary layout on input, enabling GIN index indexing for deep nested key queries.'
    },
    {
      id: 'db-9',
      category: 'Database Management (SQL)',
      skillName: 'SQL Constraints',
      topic: 'Foreign Key',
      question: 'What does `ON DELETE CASCADE` specified on a Foreign Key constraint enforce?',
      options: [
        'Prevents deletion of the parent row',
        'Automatically deletes child rows referencing the deleted parent row',
        'Sets child reference column to NULL',
        'Archives deleted records to a backup table'
      ],
      correctAnswer: 1,
      explanation: 'ON DELETE CASCADE automatically removes matching child records when the referenced parent primary key row is deleted.'
    },
    {
      id: 'db-10',
      category: 'Database Management (SQL)',
      skillName: 'Query Optimization',
      topic: 'EXPLAIN ANALYZE',
      question: 'What is the purpose of running `EXPLAIN ANALYZE` before a SQL query in PostgreSQL?',
      options: [
        'To format SQL code cleanly',
        'To execute the query and report real execution execution time, node plans, sequential/index scans, and memory usage',
        'To export query output to CSV',
        'To roll back transaction locks'
      ],
      correctAnswer: 1,
      explanation: 'EXPLAIN ANALYZE runs the statement and outputs actual execution execution times alongside estimated query planner costs.'
    },
    {
      id: 'db-11',
      category: 'Database Management (SQL)',
      skillName: 'NoSQL vs Relational',
      topic: 'CAP Theorem',
      question: 'According to the CAP Theorem for distributed databases, what 3 guarantees cannot be achieved simultaneously during network partition?',
      options: [
        'Concurrency, Accuracy, Performance',
        'Consistency, Availability, Partition Tolerance',
        'Authentication, Encryption, Compression',
        'Acid, Base, SQL'
      ],
      correctAnswer: 1,
      explanation: 'CAP states a distributed system can guarantee at most 2 of Consistency, Availability, and Partition Tolerance simultaneously.'
    },
    {
      id: 'db-12',
      category: 'Database Management (SQL)',
      skillName: 'SQL Advanced',
      topic: 'Window Functions',
      question: 'How do Window functions (e.g. `ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)`) differ from GROUP BY?',
      options: [
        'Window functions delete duplicate rows',
        'Window functions calculate aggregate values over a set of rows while preserving individual row identities without collapsing them',
        'Window functions only work on string columns',
        'Window functions execute in the web browser'
      ],
      correctAnswer: 1,
      explanation: 'Window functions evaluate over window frames without collapsing input rows into single grouped summary rows.'
    },
    {
      id: 'db-13',
      category: 'Database Management (SQL)',
      skillName: 'Database Locks',
      topic: 'Deadlock',
      question: 'What causes a Database Deadlock?',
      options: [
        'When disk space runs out completely',
        'When two or more concurrent transactions hold locks on resources and each waits for the other to release locks in a circular wait dependency',
        'When a query takes longer than 5 seconds',
        'When a primary key is missing'
      ],
      correctAnswer: 1,
      explanation: 'Deadlocks occur when circular wait conditions prevent participating transactions from completing.'
    },
    {
      id: 'db-14',
      category: 'Database Management (SQL)',
      skillName: 'SQL Statements',
      topic: 'TRUNCATE vs DELETE',
      question: 'Why is `TRUNCATE TABLE` faster than `DELETE FROM table` for removing all rows in a table?',
      options: [
        'TRUNCATE uses AI auto-deletion',
        'TRUNCATE deallocates data pages directly rather than logging row-by-row deletions in the transaction log',
        'DELETE drops table indexes permanently',
        'TRUNCATE converts table to CSV'
      ],
      correctAnswer: 1,
      explanation: 'TRUNCATE is a DDL command that deallocates storage pages with minimal undo log writes.'
    },
    {
      id: 'db-15',
      category: 'Database Management (SQL)',
      skillName: 'SQL Concepts',
      topic: 'NULL handling',
      question: 'What is the evaluation result of SQL expression `SELECT 5 + NULL`?',
      options: ['5', '0', 'NULL', 'Throws TypeError'],
      correctAnswer: 2,
      explanation: 'In SQL, arithmetic or comparisons involving NULL yield NULL (unknown value).'
    },
    {
      id: 'db-16',
      category: 'Database Management (SQL)',
      skillName: 'Database Architecture',
      topic: 'Connection Pooling',
      question: 'Why is DB Connection Pooling (e.g. PgBouncer) used in high-traffic web applications?',
      options: [
        'To encrypt database password hashes',
        'To reuse a pool of active database connection sockets, avoiding latency and overhead of establishing TCP/TLS handshakes on every HTTP request',
        'To automatically write unit tests for SQL',
        'To mirror data to local storage'
      ],
      correctAnswer: 1,
      explanation: 'Reusing persistent pooled connections eliminates process creation and authentication handshake costs per request.'
    },
    {
      id: 'db-17',
      category: 'Database Management (SQL)',
      skillName: 'PostgreSQL Features',
      topic: 'WAL (Write-Ahead Logging)',
      question: 'What is the primary role of Write-Ahead Logging (WAL) in relational databases?',
      options: [
        'To store CSS stylesheets',
        'To record changes to disk log files BEFORE applying them to data pages, guaranteeing Atomicity and Durability (crash recovery)',
        'To log user IP addresses for analytics',
        'To format JSON API responses'
      ],
      correctAnswer: 1,
      explanation: 'WAL ensures that transactions logged to non-volatile storage can be replayed to restore state after unexpected power failures.'
    },
    {
      id: 'db-18',
      category: 'Database Management (SQL)',
      skillName: 'SQL Operators',
      topic: 'EXISTS vs IN',
      question: 'Why is `EXISTS (SELECT 1 FROM ...)` often more performant than `IN (SELECT col FROM ...)` for large subqueries?',
      options: [
        'EXISTS converts subquery to Python',
        'EXISTS terminates scanning as soon as it finds the first matching row (short-circuiting), whereas IN evaluates the entire subquery list',
        'IN fails if table has more than 10 rows',
        'EXISTS bypasses database permissions'
      ],
      correctAnswer: 1,
      explanation: 'EXISTS returns true immediately on first match without buffering entire subquery result sets.'
    },
    {
      id: 'db-19',
      category: 'Database Management (SQL)',
      skillName: 'Database Views',
      topic: 'Materialized Views',
      question: 'What distinguishes a Materialized View from a standard Virtual View?',
      options: [
        'Materialized Views cannot be queried with SELECT',
        'Materialized Views physically persist query results to disk, requiring explicit refresh (REFRESH MATERIALIZED VIEW) to update',
        'Materialized Views only accept string data',
        'Virtual Views require GPU acceleration'
      ],
      correctAnswer: 1,
      explanation: 'Materialized views cache precomputed query output on disk for superfast reads at the expense of needing manual or scheduled refreshes.'
    },
    {
      id: 'db-20',
      category: 'Database Management (SQL)',
      skillName: 'Database Security',
      topic: 'Least Privilege',
      question: 'In production database user management, what does the Principle of Least Privilege dictate?',
      options: [
        'Give every app service full db_owner / superuser access for simplicity',
        'Grant database accounts only the minimum permissions (e.g. SELECT, INSERT on specific tables) strictly necessary to perform their role',
        'Disable all password authentication',
        'Store passwords in plain text'
      ],
      correctAnswer: 1,
      explanation: 'Restricting user privileges limits the blast radius of compromised credentials or SQL injection bugs.'
    }
  ],

  'Full Stack Systems': [
    {
      id: 'fs-1',
      category: 'Full Stack Systems',
      skillName: 'System Design',
      topic: 'Load Balancing',
      question: 'What is the difference between Layer 4 and Layer 7 Load Balancing?',
      options: [
        'Layer 4 balances database queries; Layer 7 balances files',
        'Layer 4 routes traffic based on network IP and TCP ports; Layer 7 inspects HTTP headers, cookies, and URL paths for intelligent routing',
        'Layer 4 is for web browsers; Layer 7 is for mobile apps',
        'Layer 7 runs only on Linux'
      ],
      correctAnswer: 1,
      explanation: 'Layer 4 handles TCP/UDP transport level, while Layer 7 parses application HTTP protocol data to make content-based routing decisions.'
    },
    {
      id: 'fs-2',
      category: 'Full Stack Systems',
      skillName: 'Web Infrastructure',
      topic: 'CDN',
      question: 'How does a Content Delivery Network (CDN) decrease page load latency for global users?',
      options: [
        'By compressing all JavaScript code into C++',
        'By caching static assets (images, JS, CSS) at edge servers distributed geographically close to the user',
        'By disabling HTTPS encryption',
        'By executing react code on the user router'
      ],
      correctAnswer: 1,
      explanation: 'Edge caching reduces round-trip time (RTT) by serving assets from point-of-presence (PoP) servers close to end users.'
    },
    {
      id: 'fs-3',
      category: 'Full Stack Systems',
      skillName: 'System Architecture',
      topic: 'Microservices vs Monolith',
      question: 'What major challenge is introduced when breaking a Monolith into Microservices?',
      options: [
        'Code can no longer be written in TypeScript',
        'Distributed complexity, data consistency across services (eventual consistency), network latency, and complex monitoring/tracing',
        'Microservices cannot use databases',
        'Microservices require physical hardware servers'
      ],
      correctAnswer: 1,
      explanation: 'Distributed microservices introduce network boundaries, saga patterns, distributed tracing, and eventual consistency trade-offs.'
    },
    {
      id: 'fs-4',
      category: 'Full Stack Systems',
      skillName: 'Web Security',
      topic: 'CSRF Protection',
      question: 'How do Anti-CSRF tokens prevent Cross-Site Request Forgery attacks on state-changing requests?',
      options: [
        'By encrypting user passwords in localStorage',
        'By validating a unique, secret server-generated token sent in custom request headers that an attacker\'s cross-origin form cannot forge',
        'By requiring users to enter CAPTCHA on every click',
        'By disabling cookies globally'
      ],
      correctAnswer: 1,
      explanation: 'Browsers automatically attach cookies to cross-site requests, but cross-site origins cannot read or craft valid CSRF header tokens.'
    },
    {
      id: 'fs-5',
      category: 'Full Stack Systems',
      skillName: 'Message Queues',
      topic: 'Asynchronous Processing',
      question: 'Why are message queues (e.g. RabbitMQ, Apache Kafka) essential for handling spike background tasks like video processing?',
      options: [
        'They replace frontend UI frameworks',
        'They decouple producers from consumers, buffering workload spikes so background workers process tasks asynchronously without blocking HTTP requests',
        'They automatically translate Python to Node.js',
        'They eliminate database storage'
      ],
      correctAnswer: 1,
      explanation: 'Message queues absorb peak traffic bursts and provide reliable async task retries and worker decoupling.'
    },
    {
      id: 'fs-6',
      category: 'Full Stack Systems',
      skillName: 'Caching Strategies',
      topic: 'Cache-Aside Pattern',
      question: 'In the Cache-Aside (Lazy Loading) caching pattern, what happens when a application reads data?',
      options: [
        'The application reads directly from the database and never checks cache',
        'The application checks cache first; on cache hit it returns data; on cache miss it reads DB, writes to cache, and returns data',
        'The cache automatically updates the database every 10 seconds',
        'Data is written to cache only when the server restarts'
      ],
      correctAnswer: 1,
      explanation: 'Cache-aside puts the application in control of querying cache first and populating missing keys upon database reads.'
    },
    {
      id: 'fs-7',
      category: 'Full Stack Systems',
      skillName: 'Web Protocols',
      topic: 'HTTP/2 vs HTTP/1.1',
      question: 'What key protocol improvement did HTTP/2 introduce over HTTP/1.1?',
      options: [
        'Deprecation of JSON format',
        'Multiplexing over a single TCP connection, header compression (HPACK), and binary framing',
        'Elimination of SSL certificates',
        'Forced page refreshes every 5 seconds'
      ],
      correctAnswer: 1,
      explanation: 'HTTP/2 multiplexes multiple concurrent requests over one TCP socket without head-of-line blocking.'
    },
    {
      id: 'fs-8',
      category: 'Full Stack Systems',
      skillName: 'DevOps & Containers',
      topic: 'Docker',
      question: 'What is the fundamental difference between a Docker Container and a Virtual Machine (VM)?',
      options: [
        'Docker containers cannot run Linux',
        'Containers share the host OS kernel and isolate user space, whereas VMs virtualize entire guest hardware and operating systems via hypervisors',
        'VMs start in 1 second; containers take 10 minutes',
        'Containers require physical GPUs'
      ],
      correctAnswer: 1,
      explanation: 'Containers share host kernel capabilities (namespaces/cgroups), making them lightweight and fast compared to full OS hypervisor VMs.'
    },
    {
      id: 'fs-9',
      category: 'Full Stack Systems',
      skillName: 'API Architecture',
      topic: 'GraphQL vs REST',
      question: 'What problem does GraphQL solve compared to traditional REST API endpoints?',
      options: [
        'GraphQL eliminates network requests completely',
        'Eliminates over-fetching and under-fetching by letting clients request exact fields in a single query payload',
        'GraphQL forces all data to be stored in MongoDB',
        'GraphQL replaces HTML templates'
      ],
      correctAnswer: 1,
      explanation: 'GraphQL client-driven schemas allow requesting precise field structures in a single round-trip.'
    },
    {
      id: 'fs-10',
      category: 'Full Stack Systems',
      skillName: 'Performance',
      topic: 'Core Web Vitals',
      question: 'What does Largest Contentful Paint (LCP) measure in Google Core Web Vitals metrics?',
      options: [
        'The time it takes for the user to type in an input',
        'The render time of the largest image or text block visible within the viewport relative to when the page first started loading',
        'Total network payload size in megabytes',
        'Number of server errors per minute'
      ],
      correctAnswer: 1,
      explanation: 'LCP measures perceived loading speed by marking when main page content has likely rendered.'
    },
    {
      id: 'fs-11',
      category: 'Full Stack Systems',
      skillName: 'API Design',
      topic: 'Idempotency',
      question: 'What makes an API endpoint "Idempotent"?',
      options: [
        'It responds in under 10 milliseconds',
        'Making multiple identical requests produces the exact same server state result as making a single request',
        'It only accepts encrypted passwords',
        'It requires OAuth authentication'
      ],
      correctAnswer: 1,
      explanation: 'Idempotent methods (GET, PUT, DELETE) produce identical state outcomes regardless of how many times executed.'
    },
    {
      id: 'fs-12',
      category: 'Full Stack Systems',
      skillName: 'Web Security',
      topic: 'HTTPS & TLS',
      question: 'During TLS 1.3 handshake setup, what key exchange algorithm enables Perfect Forward Secrecy (PFS)?',
      options: [
        'Static RSA Key Exchange',
        'Ephemeral Diffie-Hellman (ECDHE)',
        'MD5 hashing',
        'Base64 encoding'
      ],
      correctAnswer: 1,
      explanation: 'ECDHE generates unique ephemeral session keys per connection so past captured traffic cannot be decrypted if server private key leaks.'
    },
    {
      id: 'fs-13',
      category: 'Full Stack Systems',
      skillName: 'State Management',
      topic: 'SSO & OAuth 2.0',
      question: 'In OAuth 2.0 Authorization Code flow with PKCE, what is PKCE designed to protect against?',
      options: [
        'SQL Injection attacks',
        'Authorization code interception attacks on public mobile or single-page web clients',
        'DDoS attacks',
        'Database corruption'
      ],
      correctAnswer: 1,
      explanation: 'Proof Key for Code Exchange (PKCE) dynamic verifiers prevent authorization code hijacking on untrusted client applications.'
    },
    {
      id: 'fs-14',
      category: 'Full Stack Systems',
      skillName: 'CI/CD Pipelines',
      topic: 'Deployment Strategies',
      question: 'What is a Blue-Green Deployment strategy?',
      options: [
        'Deploying code only on weekends',
        'Maintaining two identical production environments (Blue active, Green new version); traffic switches to Green upon verification with zero downtime',
        'Deploying code directly to live production servers without testing',
        'Compiling CSS with green color themes'
      ],
      correctAnswer: 1,
      explanation: 'Blue-Green deployments minimize downtime and allow instant rollback by switching load balancer target groups.'
    },
    {
      id: 'fs-15',
      category: 'Full Stack Systems',
      skillName: 'System Resiliency',
      topic: 'Circuit Breaker Pattern',
      question: 'What is the primary role of the Circuit Breaker pattern in microservice architecture?',
      options: [
        'To disconnect bad users from chat rooms',
        'To fail fast and stop cascading failures when a downstream service is unresponsive, allowing it time to recover',
        'To trip hardware power switches in data centers',
        'To automatically clear browser cookies'
      ],
      correctAnswer: 1,
      explanation: 'Circuit breakers monitor remote call failures and trip open to prevent resource exhaustion across dependent services.'
    },
    {
      id: 'fs-16',
      category: 'Full Stack Systems',
      skillName: 'Web Storage',
      topic: 'IndexedDB',
      question: 'When should a browser web app use IndexedDB instead of localStorage?',
      options: [
        'When storing simple dark theme preferences under 1KB',
        'When storing large structured JSON objects, files/blobs, or executing indexed range queries client-side offline',
        'When sending data across different domains',
        'IndexedDB is deprecated'
      ],
      correctAnswer: 1,
      explanation: 'IndexedDB is an asynchronous transactional object store built for large client-side data volumes without blocking the main thread.'
    },
    {
      id: 'fs-17',
      category: 'Full Stack Systems',
      skillName: 'Observability',
      topic: 'Distributed Tracing',
      question: 'What is a Trace ID / Span ID used for in distributed systems telemetry (e.g. OpenTelemetry)?',
      options: [
        'To track user mouse clicks',
        'To correlate logs, metrics, and microservice call hops across system boundaries for a single user request',
        'To encrypt database passwords',
        'To generate unique CSS class names'
      ],
      correctAnswer: 1,
      explanation: 'Trace IDs propagate across HTTP header boundaries, tying distributed log entries together across microservices.'
    },
    {
      id: 'fs-18',
      category: 'Full Stack Systems',
      skillName: 'Web Performance',
      topic: 'Server-Side Rendering (SSR)',
      question: 'What is the primary benefit of SSR (or SSG) over purely client-side rendered SPAs?',
      options: [
        'Eliminates the need for CSS',
        'Fast First Contentful Paint (FCP), immediate HTML preview availability, and search engine crawler SEO indexing',
        'Disables JavaScript completely',
        'Reduces server hosting costs to zero'
      ],
      correctAnswer: 1,
      explanation: 'SSR pre-renders markup on the server, delivering instantly readable HTML pages before hydration scripts execute.'
    },
    {
      id: 'fs-19',
      category: 'Full Stack Systems',
      skillName: 'Database Architecture',
      topic: 'Sharding',
      question: 'What is Database Sharding?',
      options: [
        'Backing up database tables to ZIP archives',
        'Horizontally partitioning data rows across multiple database servers based on a shard key (e.g., user_id)',
        'Creating read-only view tables',
        'Deleting old log records'
      ],
      correctAnswer: 1,
      explanation: 'Sharding partitions large database tables horizontally across distinct servers to scale beyond single-node hardware bounds.'
    },
    {
      id: 'fs-20',
      category: 'Full Stack Systems',
      skillName: 'Networking',
      topic: 'DNS Lookups',
      question: 'What does a DNS `A Record` map a domain name (e.g. example.com) to?',
      options: ['An email server address', 'An IPv4 address', 'An IPv6 address', 'A text string identifier'],
      correctAnswer: 1,
      explanation: 'A records map human-readable domain names to 32-bit IPv4 network addresses.'
    }
  ]
};

// Helper: Get 20 randomized questions for a given skill category
export function getRandomQuestions(category: SkillCategory, count = 20): Question[] {
  const bank = QUESTION_BANK[category] || QUESTION_BANK['Frontend (React/JS)'];
  // Shuffle array using Fisher-Yates
  const shuffled = [...bank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
