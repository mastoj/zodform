"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfileFormValues, countries, formSchema } from "./profile-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { saveProfile } from "./profile-actions";
import { ComboboxField, InputField } from "./forms";

export const ProfileForm = () => {
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      someprop: "",
      country: "",
      zipCode: "",
      city: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: ProfileFormValues) {
    const result = await saveProfile(values);
    toast({
      title: "Profile updating",
      description: JSON.stringify(result, null, 2),
    });
    console.log("onSubmit", result);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast({
      title: "Profile updated.",
      description: JSON.stringify(values, null, 2),
    });
    console.log(values);
  }

  const selectedCountry = form.watch("country");
  const zipCodes = countries[selectedCountry]?.zipCodes ?? [];
  const zipCode = form.watch("zipCode");
  const zipCodeToString = ({ code, name }: { code: string; name: string }) =>
    `${code} - ${name}`;

  useEffect(() => {
    console.log("selectedCountry", selectedCountry);
    console.log("zipCode", zipCode);
    if (!selectedCountry || !zipCode) form.setValue("city", "");
    else {
      form.setValue(
        "city",
        countries[selectedCountry]?.zipCodes.find((zc) => zc.code === zipCode)
          ?.name ?? ""
      );
    }
  }, [zipCode, selectedCountry]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ComboboxField
          control={form.control}
          name="zipCode"
          label="Zip code"
          placeholder="Select zip code"
          emptyText="No zip found."
          description="This is the zip code that will be used in the dashboard."
          itemsComponent={(field) =>
            zipCodes.map((zc) => (
              <CommandItem
                value={zc.code}
                key={zc.code}
                onSelect={() => {
                  form.setValue("zipCode", zc.code);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    zc.code === field.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {zipCodeToString(zc)}
              </CommandItem>
            ))
          }
          renderFn={(field) =>
            field.value && zipCodes.find((zc) => zc.code === field.value)
              ? zipCodeToString(zipCodes.find((zc) => zc.code === field.value)!)
              : "Select zip"
          }
        />
        <ComboboxField
          control={form.control}
          name="country"
          label="Country"
          placeholder="Select country"
          emptyText="No country found."
          description="This is the country that will be used in the dashboard."
          itemsComponent={(field) =>
            Object.keys(countries).map((cc) => (
              <CommandItem
                value={countries[cc].name}
                key={countries[cc].code}
                onSelect={() => {
                  form.setValue("country", countries[cc].code);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    countries[cc].code === field.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {`${countries[cc].name} - ${countries[cc].code}`}
              </CommandItem>
            ))
          }
          renderFn={(field) =>
            field.value && countries[field.value]
              ? countries[field.value]?.name
              : "Select country"
          }
        />
        {/* 
        <FormField
          control={form.control}
          name="zipCode"
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
                      {field.value &&
                      zipCodes.find((zc) => zc.code === field.value)
                        ? zipCodeToString(
                            zipCodes.find((zc) => zc.code === field.value)!
                          )
                        : "Select zip"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search zip..." />
                    <CommandEmpty>No zip found.</CommandEmpty>
                    <CommandGroup>
                      {zipCodes.map((zc) => (
                        <CommandItem
                          value={zc.code}
                          key={zc.code}
                          onSelect={() => {
                            form.setValue("zipCode", zc.code);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              zc.code === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {zipCodeToString(zc)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the zip code that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country</FormLabel>
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
                      {field.value && countries[field.value]
                        ? countries[field.value]?.name
                        : "Select country"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {Object.keys(countries).map((cc) => (
                        <CommandItem
                          value={countries[cc].name}
                          key={countries[cc].code}
                          onSelect={() => {
                            form.setValue("country", countries[cc].code);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              countries[cc].code === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {`${countries[cc].name} - ${countries[cc].code}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the country that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <InputField
          control={form.control}
          name="city"
          label="City"
          placeholder="Select zip code"
          description="This is the city that will be used in the dashboard."
          disabled
        /> */}

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Select zip code" {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is the city that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <InputField
          control={form.control}
          name="someprop"
          label="Name"
          placeholder="tomas"
          description="This is the name that will be used in the dashboard."
        />
        <InputField
          control={form.control}
          name="nestedProp.someprop2"
          label="Name"
          placeholder="tomas"
          description="This is the name that will be used in the dashboard."
        />
        {/* 
        <FormField
          control={form.control}
          name="someprop"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="tomas" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        /> */}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
