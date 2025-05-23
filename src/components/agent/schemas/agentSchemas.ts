
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  cellphone: z.string().min(10, 'Cellphone number must be at least 10 digits'),
  agentId: z.string().optional(),
});

export const forgotIdSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export type AgentLoginValues = z.infer<typeof loginSchema>;
export type ForgotIdValues = z.infer<typeof forgotIdSchema>;
