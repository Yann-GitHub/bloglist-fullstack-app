const Notification = ({ message }) => {
  if (message === null) {
    return;
  }
  const errorNotificationClass =
    message.type === "error" ? "errorNotification" : "";

  return (
    <div className={`toast ${errorNotificationClass}`}>{message.message}</div>
  );
};

export default Notification;
