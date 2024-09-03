const Notification = ({ message }) => {
  if (message === null) {
    return;
  }
  const errorNotificationClass =
    message.type === "error" ? "errorNotification" : "";

  return (
    <div className="overlay">
      <div className={`toast ${errorNotificationClass}`}>{message.message}</div>
    </div>
  );
};

export default Notification;
