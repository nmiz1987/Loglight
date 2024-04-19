# Loglight

Loglight is a simple node server and web application that helps developers view and filter logs sent from their applications in real-time. It functions similarly to the console found in browser developer tools but is specifically designed for log messages.

![all messages](https://github.com/nmiz1987/ws-server/blob/master/images/all-messages.png)
![by category](https://github.com/nmiz1987/ws-server/blob/master/images/by-category.png)

## Features

1. Real-time Logging: View logs streamed from your application as they occur.
2. Filtering: Filter logs by category for a focused view.
3. Simple Interface: Easy to understand and use, allowing you to quickly debug your application.
4. Support JSON object, array, boolean, string, and number types.

## Installation:

1. Clone the repo to your computer.
1. Install all dependencies.
1. Run the server. For your convenience, there are several options to run the server:
   a. `node Loglight.js`: will start the server with the default port 8090.
   b. `node Loglight.js -p {YOUR_PORT}`: will start the server with your port (replace `{YOUR_PORT}` with your port number)
   c. `npm run start`: will start the server with the default port 8090.
   d. `npm run start -- -p {YOUR_PORT}`: will start the server with your port (replace `{YOUR_PORT}` with your port number)
1. open Loglight from the browser with the URL printed URL in the screen
   Note: You may need to refresh Loglight and your application to inform the server that there are 2 connections.

## Sendings Logs:

The server and web application use web-socket to interact quickly and efficiently, therefore your application must use a web-socket as well.
**IMPORTANT:** There are several mandatory configurations that must be met in order to avoid errors:

1. You must pass the application name in the URL query: "appName={YOUR_APPLICATION_NAME}". It is used in the server to count the number of connections.
1. Loglight was built to log JSON objects with category, your messages MUST be in this format:

```typescript
{
  messageCategory: string,
  messageData: any
}
```

If you don't care about the category, you can add an empty string.

### React / React Native app:

In the "utils" folder you will find a file called "WebSocketProvider.tsx", copy-paste it to your application.
This file is a React Context provider that contains all the required configurations ready to use.
NOTE: If you aren't using the default port, You will need to update the port in the "WebSocketProvider.tsx" file.

1. Install the [react-use-websocket](https://www.npmjs.com/package/react-use-websocket) package with the command `npm i react-use-websocket`.
1. Wrap your application (NOT a specific component to avoid rendering) with the WebSocketProvider.
1. Add the line `const { sendAnonymouslyHandler, sendWithCategoryHandler } = useSendMessage();` in every component you want use Loglight.
   a. `sendAnonymouslyHandler` used in messages without a category, but the category in Loglight will be "anonymous" (you can change it if you like)
   b. `sendWithCategoryHandler` used in messages with your own category.

## Contributing

I welcome contributions to Loglight! If you have any suggestions please feel free to open PR.
