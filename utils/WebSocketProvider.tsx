import { createContext, useContext } from "react";
import useWebSocket from "react-use-websocket";

type Props = {
  children: React.ReactNode;
};

export const WebSocketContext = createContext<{
  innerSendAnonymouslyHandler: (data: any) => void;
  innerSendWithCategoryHandler: (category: string, data: any) => void;
}>({ innerSendAnonymouslyHandler: () => {}, innerSendWithCategoryHandler: () => {} });

export default function AdoptedPetProvider({ children }: Props) {
  const PORT = 8090;
  const WS_URL = `ws://localhost:${PORT}`;
  const APP_NAME = "application";

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { appName: APP_NAME },
  });

  function innerSendAnonymouslyHandler(data: any) {
    sendJsonMessage({ messageCategory: "anonymous", messageData: data });
  }

  function innerSendWithCategoryHandler(category: string, data: any) {
    sendJsonMessage({ messageCategory: category, messageData: data });
  }

  return (
    <WebSocketContext.Provider
      value={{
        innerSendAnonymouslyHandler,
        innerSendWithCategoryHandler,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSendMessage() {
  const { innerSendAnonymouslyHandler, innerSendWithCategoryHandler } = useContext(WebSocketContext);

  function sendAnonymouslyHandler(data: any) {
    innerSendAnonymouslyHandler(data);
  }

  function sendWithCategoryHandler(key: string, data: any) {
    innerSendWithCategoryHandler(key, data);
  }

  return { sendAnonymouslyHandler, sendWithCategoryHandler };
}
