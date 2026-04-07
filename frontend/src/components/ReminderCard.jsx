import { FaBell, FaPlus, FaCalendarAlt, FaTrash } from "react-icons/fa";

function getReminderStatus(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Urgent";
  if (diffDays <= 3) return "Due Soon";
  return "Upcoming";
}

function ReminderCard({ reminders = [], onAdd, onDelete }) {
  const getBadgeClasses = (status) => {
    if (status.includes("Overdue")) return "bg-red-100 text-red-600";
    if (status.includes("Urgent")) return "bg-orange-100 text-orange-600";
    if (status.includes("Due Soon")) return "bg-yellow-100 text-yellow-700";
    return "bg-emerald-100 text-emerald-600";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaBell />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">Reminders</h3>
            <p className="text-xs text-slate-500">Upcoming tasks</p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-700"
        >
          <FaPlus className="text-[10px]" />
          Add
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No reminders yet.
        </div>
      ) : (
        reminders.map((item) => {
          const status = getReminderStatus(item.dueDate);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-slate-800">
                    {item.title}
                  </h4>

                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <FaCalendarAlt className="text-[10px]" />
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${getBadgeClasses(
                      status
                    )}`}
                  >
                    {status}
                  </span>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
                    title="Delete reminder"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ReminderCard;