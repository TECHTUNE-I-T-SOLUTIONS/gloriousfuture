"use client";
import React, { createContext, useContext } from "react";

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ children, className = "", value, onValueChange, ...props }) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>
    <fieldset className={`${className}`} {...props}>
      {children}
    </fieldset>
  </RadioGroupContext.Provider>
);

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ className = "mr-2", value, ...props }) => {
  const ctx = useContext(RadioGroupContext);
  const checked = ctx.value === value;

  return (
    <input
      type="radio"
      className={className}
      {...props}
      value={value}
      checked={checked}
      onChange={() => ctx.onValueChange?.(value)}
    />
  );
};

export default RadioGroup;
