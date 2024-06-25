import { useContext } from "react";
import { ToastContext } from "../App";

export default function useNotification() {
  const messageApi = useContext(ToastContext);
  return messageApi;
}
