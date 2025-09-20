import React, { useEffect, useRef, useState } from 'react';
import { Datepicker } from 'flowbite';

const DateTimePicker = ({ date, updateFunction, id }) => {
  const datepickerRef = useRef(null);
  const datepickerInstance = useRef(null);

  const [time, setTime] = useState(() => {
    if (!date) return '00:00';
    const d = new Date(date);
    return d.toTimeString().slice(0, 5); // "HH:mm"
  });

  const pad = (num) => String(num).padStart(2, '0');
  const localToISOString = (date) => {
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':00'
    );
  };

  useEffect(() => {
    const $el = datepickerRef.current;
    if (!$el) return;

    datepickerInstance.current = new Datepicker($el, {
      autohide: true,
      format: 'dd/mm/yyyy',
    });

    const handleDateChange = (event) => {
      const selectedDate = event.target.value; // "dd/mm/yyyy"
      if (!selectedDate) return;

      const [day, month, year] = selectedDate.split('/').map(Number);
      const safeTime = time || '00:00';

      const [hours, minutes] = safeTime.split(':').map(Number);
      const combinedDate = new Date(year, month - 1, day, hours, minutes, 0);

      if (!isNaN(combinedDate)) {
        updateFunction(localToISOString(combinedDate));
      } else {
        console.error('Invalid combined date/time');
      }
    };

    $el.addEventListener('changeDate', handleDateChange);

    return () => {
      $el.removeEventListener('changeDate', handleDateChange);
      if (datepickerInstance.current) datepickerInstance.current.destroy();
    };
  }, [time, updateFunction]);

  useEffect(() => {
    const $el = datepickerRef.current;
    if ($el) {
      if (date && !isNaN(new Date(date))) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        $el.value = formattedDate;
        setTime(d.toTimeString().slice(0, 5));

        if (datepickerInstance.current) {
          datepickerInstance.current.setDate(formattedDate, true);
        }
      } else {
        $el.value = '';
        setTime('00:00');
      }
    }
  }, [date]);

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (!date) return;

    const d = new Date(date);
    const [hours, minutes] = newTime.split(':').map(Number);
    d.setHours(hours, minutes, 0, 0);

    if (!isNaN(d)) {
      updateFunction(localToISOString(d));
    } else {
      console.error('Invalid date/time on time change');
    }
  };

  return (
    <div className="flex gap-2 max-w-sm">
      <div className="relative flex-1">
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
      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
      />
    </div>
  );
};

export default DateTimePicker;
