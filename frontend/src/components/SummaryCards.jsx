import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

function SummaryCards({ expenses }) {
  const totalCredit = expenses
    .filter((item) => item.type === "Credit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalDebit = expenses
    .filter((item) => item.type === "Debit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalCredit - totalDebit;

  const cards = [
    {
      title: "Total Credit",
      amount: totalCredit,
      icon: <FaArrowUp />,
      style: "from-green-500 to-emerald-400",
    },
    {
      title: "Total Debit",
      amount: totalDebit,
      icon: <FaArrowDown />,
      style: "from-red-500 to-rose-400",
    },
    {
      title: "Balance",
      amount: balance,
      icon: <FaWallet />,
      style: "from-blue-600 to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${card.style} p-6 text-white shadow-lg hover:scale-105 transition-all duration-300`}
        >
          {/* Icon */}
          <div className="absolute top-4 right-4 text-3xl opacity-80">
            {card.icon}
          </div>

          {/* Title */}
          <p className="text-lg font-medium opacity-90">{card.title}</p>

          {/* Amount */}
          <h3 className="mt-4 text-3xl md:text-4xl font-bold">
            ₹{card.amount.toLocaleString()}
          </h3>

          {/* Glow effect */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;