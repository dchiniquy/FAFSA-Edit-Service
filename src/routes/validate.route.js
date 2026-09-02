const express = require('express');
const { applicationSchema } = require('../schema/applicationSchema');
const { evaluate } = require('../rules/ruleEngine');

const router = express.Router();

router.post('/validate', (req, res) => {
  const parseResult = applicationSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parseResult.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const result = evaluate(parseResult.data);
  return res.status(200).json(result);
});

module.exports = router;
