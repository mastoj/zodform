"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfileFormValues, countries, formSchema } from "./profile-schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { saveProfile } from "./profile-actions";
import { ComboboxField, InputField } from "./forms";

export const ProfileForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      someprop: "",
      country: "",
      zipCode: "",
      city: "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    const result = await saveProfile(values);
    toast({
      title: "Profile updated on server",
      description: JSON.stringify({ result, values }, null, 2),
    });
    console.log("onSubmit", result);
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
        <InputField
          control={form.control}
          name="city"
          label="City"
          placeholder="Select zip code"
          description="This is the city that will be used in the dashboard."
          disabled
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
