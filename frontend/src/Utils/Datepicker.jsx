import React, { useEffect, useRef } from 'react';
import { Datepicker } from 'flowbite';

const DatePicker = ({ date, updateFunction, id }) => {
  const datepickerRef = useRef(null);
  const datepickerInstance = useRef(null);

  useEffect(() => {
    const $el = datepickerRef.current;
    if (!$el) return;

    datepickerInstance.current = new Datepicker($el, {
      autohide: true,
      format: 'dd/mm/yyyy',
    });

    const handleDateChange = (event) => {
      const value = event.target.value;
      updateFunction(value);
    };

    $el.addEventListener('changeDate', handleDateChange);

    return () => {
      $el.removeEventListener('changeDate', handleDateChange);
      datepickerInstance.current.destroy();
    };
  }, []);
  useEffect(() => {
    const $el = datepickerRef.current;
    if ($el && date && !isNaN(new Date(date))) {
      $el.value = new Date(date).toLocaleDateString('en-GB');
    }
  }, [date]);

  return (
    <div className="relative max-w-sm">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg>
      </div>
      <input
        ref={datepickerRef}
        id={id}
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
        placeholder="Select date"
        readOnly
      />
    </div>
  );
};

export default DatePicker;
