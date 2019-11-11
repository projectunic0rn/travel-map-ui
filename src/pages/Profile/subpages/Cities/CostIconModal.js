import React from "react";
import PropTypes from 'prop-types';

function CostIconModal({cost, currency, handleCostChange, handleCurrencyChange}) {
  return (
    <div className="cost-icon-modal">
      <input
        type="integer"
        onChange={(e) => handleCostChange(e.target.value)}
        className="cost-icon-text"
        placeholder={
          cost !== "" && cost !== null
            ? cost
            : "Cost/person"
        }
      />
      <select
        className="cost-icon-currency"
        onChange={(e) => handleCurrencyChange(e.target.value)}
        value={currency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
    </div>
  );
}

CostIconModal.propTypes = {
    cost: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    handleCostChange: PropTypes.func,
    currency: PropTypes.string,
    handleCurrencyChange: PropTypes.func
}

export default CostIconModal;
