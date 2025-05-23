
import { z } from "zod";

export const storeFormSchema = z.object({
  name: z.string().min(2, "Store name is required"),
  description: z.string().min(10, "Please provide a description (min 10 characters)"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1, "Please select a category"),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;

export const defaultValues: Partial<StoreFormValues> = {
  name: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  category: "",
};

export const STORE_CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Garden" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "toys", label: "Toys & Games" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "books", label: "Books & Media" },
  { value: "handmade", label: "Handmade" },
  { value: "other", label: "Other" },
];
