/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

export const ReactSelect = function App() {
  const [inputValue, setInputValue] = useState('');

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const filterColors = (value: string) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(value.toLowerCase()),
    );
  };

  const loadOptions = (value: string, callback: any) => {
    setTimeout(() => {
      callback(filterColors(value));
    }, 1000);
  };

  const handleInputChange = (newValue: string) => {
    const value = newValue.replace(/\W/g, '');
    setInputValue(value);
    return inputValue;
  };

  return (
    <div>
      <pre>
        inputValue:
        {inputValue}
      </pre>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onInputChange={handleInputChange}
      />
    </div>
  );
};
