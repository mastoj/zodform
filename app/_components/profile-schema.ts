import * as z from "zod";

type Country = {
  name: string;
  code: string;
  zipCodes: {
    name: string;
    code: string;
  }[];
};

export const countries: { [key: string]: Country } = {
  no: {
    name: "Norway",
    code: "no",
    zipCodes: [
      {
        name: "Oslo",
        code: "0100",
      },
      {
        name: "Bergen",
        code: "5000",
      },
    ],
  },
  se: {
    name: "Sweden",
    code: "se",
    zipCodes: [
      {
        name: "Stockholm",
        code: "10000",
      },
      {
        name: "Malmö",
        code: "20000",
      },
    ],
  },
};

export const formSchema = z.object({
  country: z
    .string()
    .refine((val) => Object.keys(countries).includes(val), "Invalid country"),
  zipCode: z.string(),
  city: z.string(),
  someprop: z.string().min(2).max(50),
});
// .refine(
//   (val) => {
//     const country = countries[val.country];
//     return (
//       country && country.zipCodes.map((z) => z.code).includes(val.zipCode)
//     );
//   },
//   {
//     path: ["zipCode"],
//     message: "Invalid zip code",
//   }
// );

export type ProfileFormValues = z.infer<typeof formSchema>;
