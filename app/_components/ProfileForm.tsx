"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useForm,
} from "react-hook-form";
import * as z from "zod";
import { ProfileFormValues, formSchema } from "./profile-schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveProfile } from "./profile-actions";
import { InputField } from "./forms";

const SocialFields = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: UseControllerProps<TFieldValues, TName>
) => {
  console.log("==> props", props);
  const { control, name } = props;
  return (
    <>
      {" "}
      <InputField
        control={control}
        name={`${name}.twitter`}
        label="twitter"
        placeholder="Twitter handle"
        description=""
      />
    </>
  );
};

export const ProfileForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      someprop: "some value",
      social: {
        twitter: "MyHandle",
      },
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    const result = await saveProfile(values);
    toast({
      title: "Profile updated on server",
      description: JSON.stringify({ result, values }, null, 2),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <InputField
          control={form.control}
          name="someprop"
          label="Name"
          placeholder="tomas"
          description="This is the name that will be used in the dashboard."
        />
        <SocialFields control={form.control} name="social" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
