function ReminderCard() {
  const reminders = [
    {
      id: 1,
      title: "Electricity Bill",
      dueDate: "2026-04-05",
      status: "Due Soon",
    },
    {
      id: 2,
      title: "WiFi Recharge",
      dueDate: "2026-04-08",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "House Rent",
      dueDate: "2026-04-10",
      status: "Upcoming",
    },
  ];

  return (
    <div className="card">
      <h3>Reminders & Alerts</h3>

      {reminders.map((item) => (
        <div key={item.id} className="reminder-item">
          <div>
            <h4>{item.title}</h4>
            <p>Due: {item.dueDate}</p>
          </div>
          <span className="reminder-badge">{item.status}</span>
        </div>
      ))}
    </div>
  );
}

export default ReminderCard;