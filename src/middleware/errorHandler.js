function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// express.json() throws a raw SyntaxError on malformed JSON bodies - without this
// handler that leaks as a generic 500/HTML response instead of our 400 contract.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isBodyParseError = err.type === 'entity.parse.failed' || err instanceof SyntaxError;
  if (isBodyParseError) {
    return res.status(400).json({ error: 'Malformed JSON body', details: [] });
  }
  return res.status(err.status || 500).json({ error: 'Internal server error' });
}

module.exports = { notFoundHandler, errorHandler };
