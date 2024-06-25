import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import { createContext } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers";

export const ToastContext = createContext<NotificationInstance | null>(null);
const queryClient = new QueryClient();

function App() {
  const [messageApi, contextHolder] = notification.useNotification();

  return (
    <ToastContext.Provider value={messageApi}>
      {contextHolder}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ToastContext.Provider>
  );
}

export default App;
