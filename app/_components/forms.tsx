import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import {
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

export const InputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  placeholder,
  description,
  disabled,
  ...props
}: UseControllerProps<TFieldValues, TName> & {
  label: string;
  placeholder: string;
  description: string;
}) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} disabled={disabled} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export const ComboboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  emptyText,
  placeholder,
  itemsComponent,
  description,
  renderFn,
  ...props
}: UseControllerProps<TFieldValues, TName> & {
  label: string;
  placeholder: string;
  emptyText: string;
  description: string;
  itemsComponent: (
    field: ControllerRenderProps<TFieldValues, TName>
  ) => React.ReactNode;
  renderFn: (field: ControllerRenderProps<TFieldValues, TName>) => string;
}) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Zip code</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {renderFn(field)}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={placeholder} />
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>{itemsComponent(field)}</CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
