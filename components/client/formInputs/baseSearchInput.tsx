"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconType } from "react-icons";
import { useDebounce } from "use-debounce";
import { HexColorPicker } from "react-colorful";

import { RiErrorWarningLine } from "react-icons/ri";
import { CiCircleRemove, CiSearch } from "react-icons/ci";
import { MouseEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/hooks";

type BaseSearchInputPropsType = {
  htmlId: string;
  label: string;
  placeholder: string;
  icon: IconType;
  handleSubmission: (inputText: string) => void;
  handleDelete: (inputText: string | null) => void;
  inputFinalized: boolean;
  errorMessage: string;
  setErrorMessage: (inputText: string) => void;
  initialValue: string;
  handleAutocomplete: (inputText: string) => Promise<any>;
  handleLineColorChange: (inputText: string) => void;
  defaultLineColorHex: string;
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
  initialValue,
  handleAutocomplete,
  defaultLineColorHex,
  handleLineColorChange,
}: BaseSearchInputPropsType) {
  const [inputText, setInputText] = useState(initialValue || "");
  const [searchValues, setSearchValues] = useState([]);
  const [submittedText, setSubmittedText] = useState("");
  const [searchText] = useDebounce(inputText, 500);
  const [isFocused, setIsFocused] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [lineColor, setLineColor] = useState(defaultLineColorHex);

  const colorPopover = useRef(null);
  const iconButtonRef = useRef(null);

  useClickOutside(colorPopover, () => setIsColorPickerOpen(false));

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

  // https://muffinman.io/blog/catching-the-blur-event-on-an-element-and-its-children/
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const currentTarget = e.currentTarget;

    // Give browser time to focus the next element
    requestAnimationFrame(() => {
      // Check if the new focused element is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        return setIsFocused(false);
      }

      return setIsFocused(true);
    });
  }, []);

  const handleDropdownSelection = (inputText: string) => {
    setIsFocused(true);
    setInputText(inputText);
    handleSubmission(inputText);
    setSubmittedText(inputText);
    setIsFocused(false);
  };

  const handleDropdownEnterKey = (e, inputText) => {
    if (e.key === "Enter") {
      handleDropdownSelection(inputText);
    }
  };

  useEffect(() => {
    if (searchText && !inputFinalized && !initialValue) {
      const getList = async (inputText: string) => {
        const list = await handleAutocomplete(inputText);
        setSearchValues(list);
        return list;
      };

      getList(searchText);
    }
  }, [searchText, handleAutocomplete, initialValue, inputFinalized]);

  useEffect(() => {
    if (!inputText) {
      setSearchValues([]);
    }
  }, [inputText]);

  useEffect(() => {
    if (!isColorPickerOpen) {
      handleLineColorChange(lineColor);
    }
  }, [isColorPickerOpen]);

  return (
    <fieldset>
      <Label hidden className="text-gray-300" htmlFor={htmlId}>
        {label}
      </Label>
      <div className="flex flex-row items-center cursor-pointer">
        <div className="relative">
          <Button
            className={`mr-2 p-1 bg-transparent border border-transparent ${
              isColorPickerOpen && "border-white"
            }`}
            ref={iconButtonRef}
            style={{ backgroundColor: lineColor }}
            onClick={(e) => {
              e.preventDefault();
              if (inputFinalized) {
                setIsColorPickerOpen(!isColorPickerOpen);
              }
            }}
          >
            <Icon size="1.8em" />
          </Button>

          {isColorPickerOpen && (
            <div className="popover absolute z-20" ref={colorPopover}>
              <HexColorPicker color={lineColor} onChange={setLineColor} />
            </div>
          )}
        </div>

        <div
          className="relative flex-1"
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        >
          <Input
            className="bg-gray-700 text-white placeholder-gray-500 border-none active:border aria-[invalid=error]:border-red-500"
            id={htmlId}
            placeholder={placeholder}
            value={inputText}
            onChange={handleOnChange}
            onKeyDown={handleSubmit}
            disabled={inputFinalized}
            aria-invalid={errorMessage}
          />

          {searchValues?.length > 0 && isFocused && (
            <div className="bg-gray-700 overflow-hidden absolute z-10 w-full rounded border-white mt-1">
              <ul>
                {searchValues.map((item) => {
                  return (
                    <li
                      key={item.name}
                      tabIndex={0}
                      className="pl-2 p-1 hover:bg-gray-500 cursor-pointer"
                      onClick={() => handleDropdownSelection(item.value)}
                      onKeyDown={(e) => handleDropdownEnterKey(e, item.value)}
                    >
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {!inputFinalized && (
          <Button className="ml-1 px-1" variant="ghost" onClick={handleSubmit}>
            <CiSearch size="1.8em" />
          </Button>
        )}

        <Button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(!inputFinalized ? null : inputText);
          }}
          className={cn("px-1", inputFinalized ? "ml-1" : "")}
          variant="ghost"
        >
          <CiCircleRemove size="1.8em" />
        </Button>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-xs italic ml-8 mt-1 flex items-center">
          <RiErrorWarningLine className="mr-1" /> {errorMessage}
        </p>
      )}
    </fieldset>
  );
}
