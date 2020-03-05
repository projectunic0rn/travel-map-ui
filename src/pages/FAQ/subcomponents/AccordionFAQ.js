import React, { useState } from "react";
import PropTypes from "prop-types";

function AccordionFAQ({ text, title }) {
  const [open, toggleOpen] = useState(false);

  return (
    <div className="panel panel-default" id="panel4">
      <div className="panel-heading">
        <h4 className="panel-title" onClick={() => toggleOpen(!open)}>
          ・{title}?
        </h4>
      </div>
      <div className="panel-collapse collapse in">
        {open ? <div className="panel-body">{text}</div> : null}
      </div>
    </div>
  );
}

AccordionFAQ.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string
};

export default AccordionFAQ;
