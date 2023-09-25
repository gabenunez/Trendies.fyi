"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconType } from "react-icons";

import { RiErrorWarningLine } from "react-icons/ri";
import { CiCircleRemove, CiSearch } from "react-icons/ci";
import { MouseEvent, KeyboardEvent } from "react";

type BaseSearchInputPropsType = {
  htmlId: string;
  label: string;
  placeholder: string;
  icon: IconType;
  handleSubmission: (inputText: string) => void;
  handleDelete: (inputText: string) => void;
  inputFinalized: boolean;
  errorMessage: string;
  setErrorMessage: (inputText: string) => void;
};

export default function BaseSearchInput({
  htmlId,
  label,
  placeholder,
  icon: Icon,
  handleSubmission,
  handleDelete,
  inputFinalized,
  errorMessage,
  setErrorMessage,
}: BaseSearchInputPropsType) {
  const [inputText, setInputText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  const handleSubmit = (event: KeyboardEvent | MouseEvent) => {
    if ("key" in event && event.key === "Enter") {
      event.preventDefault();
      handleSubmission(inputText);
      setSubmittedText(inputText);
    }

    if ("button" in event) {
      event.preventDefault();
      handleSubmission(inputText);
      setSubmittedText(inputText);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    const newText = event.target.value;
    setInputText(newText);
  };

  return (
    <fieldset>
      <Label hidden className="text-gray-300" htmlFor={htmlId}>
        {label}
      </Label>
      <div className="flex flex-row items-center">
        <Icon size="1.8em" className="mr-2" />

        <Input
          className="bg-gray-700 text-white placeholder-gray-500 aria-[invalid=error]:border-red-500"
          id={htmlId}
          placeholder={placeholder}
          value={inputText}
          onChange={handleOnChange}
          onKeyDown={handleSubmit}
          disabled={inputFinalized}
          aria-invalid={errorMessage}
        />

        {inputFinalized ? (
          <Button
            onClick={() => handleDelete(inputText)}
            className="ml-1 px-1"
            variant="ghost"
          >
            <CiCircleRemove size="1.8em" />
          </Button>
        ) : (
          <Button className="ml-1 px-1" variant="ghost" onClick={handleSubmit}>
            <CiSearch size="1.8em" />
          </Button>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-xs italic ml-8 mt-1 flex items-center">
          <RiErrorWarningLine className="mr-1" /> {errorMessage}
        </p>
      )}
    </fieldset>
  );
}
