import React from "react";
import PropTypes from "prop-types";

function CostIconModal({
  edit,
  cost,
  currency,
  handleCostChange,
  handleCurrencyChange
}) {
  return (
    <div className="cost-icon-modal">
      {edit ? (
        <>
          <input
            type="integer"
            onChange={e => handleCostChange(e.target.value)}
            className="cost-icon-text"
            placeholder="Cost/person"
            defaultValue={cost !== "" && cost !== null ? cost : null}
          />
          <select
            className="cost-icon-currency"
            onChange={e => handleCurrencyChange(e.target.value)}
            value={currency}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </>
      ) : (
        <>
          <input
            type="integer"
            readOnly
            className="cost-icon-text"
            placeholder={cost !== "" && cost !== null ? cost : "Cost/person"}
          />
          <select
            className="cost-icon-currency"
            disabled={true}
            value={currency}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </>
      )}
    </div>
  );
}

CostIconModal.propTypes = {
  cost: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleCostChange: PropTypes.func,
  currency: PropTypes.string,
  handleCurrencyChange: PropTypes.func,
  edit: PropTypes.bool
};

export default CostIconModal;
