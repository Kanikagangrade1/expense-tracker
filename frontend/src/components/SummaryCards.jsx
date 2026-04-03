function SummaryCards({ expenses }) {
  const totalCredit = expenses
    .filter((item) => item.type === "Credit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalDebit = expenses
    .filter((item) => item.type === "Debit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalCredit - totalDebit;

  return (
    <div className="summary-container">
      <div className="summary-card credit">
        <h4>Total Credit</h4>
        <p>₹{totalCredit}</p>
      </div>

      <div className="summary-card debit">
        <h4>Total Debit</h4>
        <p>₹{totalDebit}</p>
      </div>

      <div className="summary-card balance">
        <h4>Balance</h4>
        <p>₹{balance}</p>
      </div>
    </div>
  );
}

export default SummaryCards;