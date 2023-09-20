"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { RiStockFill } from "react-icons/ri";
import { CiCircleRemove, CiSearch } from "react-icons/ci";
import { MouseEvent, KeyboardEvent } from "react";

type BaseSearchInputPropsType = {
  htmlId: string;
  label: string;
  placeholder: string;
  handleSubmission: (inputText: string) => void;
  handleDelete: (inputText: string) => void;
  inputFinalized: boolean;
};

export default function BaseSearchInput({
  htmlId,
  label,
  placeholder,
  handleSubmission,
  handleDelete,
  inputFinalized,
}: BaseSearchInputPropsType) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (event: KeyboardEvent | MouseEvent) => {
    if ("key" in event && event.key === "Enter") {
      event.preventDefault();
      handleSubmission(inputText);
    }

    if ("button" in event) {
      event.preventDefault();
      handleSubmission(inputText);
    }
  };

  return (
    <fieldset>
      <Label hidden className="text-gray-300" htmlFor={htmlId}>
        {label}
      </Label>
      <div className="flex items-center">
        <RiStockFill size="1.8em" className="mr-2" />
        <Input
          className="bg-gray-700 text-white placeholder-gray-500"
          id={htmlId}
          placeholder={placeholder}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleSubmit}
          disabled={inputFinalized}
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
    </fieldset>
  );
}
