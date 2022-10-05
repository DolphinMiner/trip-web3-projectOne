import React from "react";

const WaitingForTransactionMessage = ({ txHash }) => {
  return (
    <div className="alert alert-info" role="alert">
      Waiting for transaction <strong>{txHash}</strong> to be mined
    </div>
  );
}

export default WaitingForTransactionMessage;
