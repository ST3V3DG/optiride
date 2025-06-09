"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { City, Ride, User } from "@/db/schema";

export function Combobox({
  collection,
  className,
  placeholder,
  value,
  setValue,
}: {
  collection: Array<{ id: number | null; label: string | null }> | undefined;
  className?: string;
  placeholder?: string;
  value: number | null | undefined;
  setValue: React.Dispatch<
    React.SetStateAction<number | City | User | Ride | null>
  >;
}) {
  const [open, setOpen] = React.useState(false);

  // Find the label for the currently selected value to display in the button
  const selectedLabel =
    value != null // Check if value is not null or undefined
      ? collection?.find((item) => item.id === value)?.label ?? "Select item..." // Use ?? for fallback
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          // Ensure the button width applies correctly, default w-[200px] might be overridden
          className={cn("w-full justify-between", className)} // Adjusted width handling
        >
          {/* Ensure label is displayed, handle potential null/undefined */}
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Make PopoverContent width match the trigger */}
      <PopoverContent
        className="p-0 z-1000"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {collection?.map(
                (item) =>
                  // Ensure item and its properties are valid before rendering
                  item && item.id != null && item.label != null ? (
                    <CommandItem
                      key={item.id}
                      // *** CHANGE HERE: Use label for filtering/value ***
                      value={item.label}
                      onSelect={(currentLabel) => {
                        // *** CHANGE HERE: Find item by label and set its ID ***
                        const selectedItem = collection?.find(
                          (i) => i.label === currentLabel
                        );
                        if (selectedItem) {
                          setValue(selectedItem.id);
                        } else {
                          setValue(null); // Handle case where item not found (optional)
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          // Compare selected value (ID) with item's ID
                          value === item.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ) : null // Don't render item if id or label is null/undefined
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
