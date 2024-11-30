
Welcome to the Starter Plugin! This plugin is designed to provide a simple and effective way to integrate with your application using the Webito Plugin SDK.

## Features

- **Easy Integration**: Quickly integrate with your existing application.
- **Hooks**: Utilize hooks like `messagesCreate` and `productsCreate` to extend functionality.
- **Asynchronous Operations**: Leverage asynchronous operations for better performance.

## Installation

To install the Starter Plugin, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/webito-io/webito-plugin-starter
   cd starter-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the plugin:
   ```bash
   node dist/index.js
   ```

## Usage

### Registering Hooks

You can register hooks to handle specific events:

```javascript
starter.registerHook('messagesCreate', ({ target }) => {
    // Your logic here
});
```

### Executing Hooks

You can execute hooks with the following function:

```javascript
const result = await starter.executeHook('hookName', { data });
```

## Contributing

We welcome contributions! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.