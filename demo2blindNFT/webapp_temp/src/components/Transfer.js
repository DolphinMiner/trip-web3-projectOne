import React from "react";

export function Transfer({ transferTokens, transferEthers, tokenSymbol }) {
  return (
    <div>
      <h4>Transfer</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to = formData.get("to");
          const amount = formData.get("amount");

          if (to && amount) {
            transferTokens(to, amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Recipient address</label>
          <input className="form-control" type="text" name="to" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="FreeMint" />
        </div>
      </form>
        <form
            onSubmit={(event) => {
                // This function just calls the transferTokens callback with the
                // form's data.
                event.preventDefault();

                const formData = new FormData(event.target);
                const to = formData.get("to");
                const amount = formData.get("amount");
                const data = formData.get("data");

                if (to && amount) {
                    transferEthers(to, amount, data);
                }
            }}
        >
            <div className="form-group">
                <label>Amount of Ether</label>
                <input
                    className="form-control"
                    type="number"
                    step="0.001"
                    name="amount"
                    placeholder="0.001"
                    required
                />
            </div>
            <div className="form-group">
                <label>Recipient address</label>
                <input className="form-control" type="text" name="to" required />
            </div>
            <div className="form-group">
                <label>Input Data</label>
                <input className="form-control" type="text" name="data" required />
            </div>
            <div className="form-group">
                <input className="btn btn-primary" type="submit" value="Transfer" />
            </div>
        </form>
    </div>
  );
}
