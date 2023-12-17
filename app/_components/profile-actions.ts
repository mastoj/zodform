"use server";

import { ProfileFormValues } from "./profile-schema";

export const saveProfile = async (values: ProfileFormValues) => {
  console.log("Saving profile", values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Profile saved");
  return {
    success: true,
    message: "Profile saved",
  };
};
