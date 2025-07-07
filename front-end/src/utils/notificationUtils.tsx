import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationProps {
  message: string;
  description?: string;
  duration?: number;
  placement?: "top" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

export const useCustomNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType, props: NotificationProps) => {
    api[type]({
      message: props.message,
      description: props.description,
      duration: props.duration || 4.5,
      placement: props.placement || "topRight",
    });
  };

  return { openNotification, contextHolder };
};