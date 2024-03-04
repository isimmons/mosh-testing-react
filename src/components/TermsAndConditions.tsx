import { useState } from "react";

const TermsAndConditions = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <h1>Terms & Conditions</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem,
        delectus.
      </p>
      <div className="pb-3">
        <label htmlFor="agree">
          <input
            type="checkbox"
            id="agree"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mr-1  checked:accent-emerald-500"
          />
          I accept the terms and conditions.
        </label>
      </div>
      <button
        disabled={!isChecked}
        className="btn disabled:bg-blue-300 disabled:text-slate-300"
      >
        Submit
      </button>
    </div>
  );
};

export default TermsAndConditions;
