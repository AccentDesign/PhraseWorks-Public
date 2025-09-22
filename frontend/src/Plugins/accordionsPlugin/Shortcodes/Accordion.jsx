import React, { useEffect, useState } from 'react';
import { APIGetAccordion } from '../API/APIAccordions';

const Accordion = ({ id, overrideActive, ...props }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const fetchData = async () => {
    const data = await APIGetAccordion(id);
    if (data.status == 200 && data.data.getAccordion) {
      setTitle(data.data.getAccordion.title);
      setItems(data.data.getAccordion.fields.fields);
      setActive(data.data.getAccordion.status == 'active' ? true : false);
      if (overrideActive) {
        setActive(true);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await APIGetAccordion(id);
      if (!isMounted) return;

      if (data.status === 200 && data.data.getAccordion) {
        setTitle(data.data.getAccordion.title);
        setItems(data.data.getAccordion.fields.fields);
        setActive(data.data.getAccordion.status === 'active');
        if (overrideActive) setActive(true);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, overrideActive]);

  if (active) {
    return (
      <div className="mb-4">
        <div className="mt-4 pb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <div className="pb-4">
          <div className="w-full">
            {items.map((item, index) => (
              <div key={index} className="border-b border-gray-400">
                <div
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center py-4 px-6 text-left bg-gray-500 font-semibold text-white hover:bg-gray-400 transition cursor-pointer"
                >
                  <p>{item.title}</p>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 mx-4 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {openIndex === index && (
                  <div className="px-6 py-4 text-gray-600 bg-gray-100 animate-fade-in">
                    <div>{item.content}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default Accordion;
