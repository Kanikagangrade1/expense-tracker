import { getReminderStatus } from "../../../backend/utils/reminderStatus";

function ReminderCard({ reminders = [] }) {
  return (
    <div className="card">
      <h3>Reminders & Alerts</h3>

      {reminders.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        reminders.map((item) => {
          const status = getReminderStatus(item.dueDate);

          return (
            <div key={item.id} className="reminder-item">
              <div>
                <h4>{item.title}</h4>
                <p>Due: {new Date(item.dueDate).toLocaleDateString()}</p>
              </div>

              <span
                className={`reminder-badge ${
                  status.includes("Overdue")
                    ? "red"
                    : status.includes("Urgent")
                    ? "orange"
                    : status.includes("Due Soon")
                    ? "yellow"
                    : "green"
                }`}
              >
                {status}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ReminderCard;