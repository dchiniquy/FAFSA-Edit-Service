const { z } = require('zod');

// Deliberately permissive on presence (almost everything is optional) - "missing"
// is a business-rule concern handled by the edit rules, not a schema-level 400.
// Strict on type: SSNs are required to be strings (never a JSON number, which
// would silently lose a leading zero) and income is a strict number (no
// numeric-string coercion). dependencyStatus/maritalStatus are validated as
// enums here because an invalid value breaks the premise of the rules that
// branch on them - see DECISIONS.md.

const studentInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  ssn: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const spouseInfoSchema = z.object({
  name: z.string().optional(),
  ssn: z.string().optional(),
});

const householdSchema = z.object({
  numberInHousehold: z.number().optional(),
  numberInCollege: z.number().optional(),
});

const incomeSchema = z.object({
  studentIncome: z.number().optional(),
  parentIncome: z.number().optional(),
});

const applicationSchema = z.object({
  studentInfo: studentInfoSchema.optional(),
  dependencyStatus: z.enum(['dependent', 'independent']).optional(),
  maritalStatus: z.enum(['single', 'married']).optional(),
  spouseInfo: spouseInfoSchema.optional(),
  household: householdSchema.optional(),
  income: incomeSchema.optional(),
  stateOfResidence: z.string().optional(),
});

module.exports = { applicationSchema };
