const { z } = require('zod');

// ── CREATE SCHEMA ─────────────────────────────────────────────
// title is required — every task must have a name
// everything else is optional with sensible defaults
const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),

  description: z
    .string()
    .max(1000, 'Description too long')
    .optional(),            // optional — not all tasks need a description

  status: z
    .enum(['pending', 'in_progress', 'done'])
    .optional()
    .default('pending'),    // if not sent, default to pending

  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .default('medium'),     // if not sent, default to medium

  category_id: z
    .number()
    .int()
    .positive('category_id must be a positive integer')
    .optional(),            // tasks don't need a category
});


// ── UPDATE SCHEMA ─────────────────────────────────────────────
// for PATCH — ALL fields are optional
// but at least ONE must be present (no empty body updates)
const updateTaskSchema = z.object({
  title:       z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status:      z.enum(['pending', 'in_progress', 'done']).optional(),
  priority:    z.enum(['low', 'medium', 'high']).optional(),
  category_id: z.number().int().positive().optional(),
})
.refine(
  data => Object.keys(data).length > 0,
  { message: 'At least one field is required for update' }
);
// .refine() adds custom validation on top of field validation
// rejects empty body {} — must send at least one field


module.exports = { createTaskSchema, updateTaskSchema };