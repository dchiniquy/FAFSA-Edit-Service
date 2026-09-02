const { notFoundHandler, errorHandler } = require('../../../src/middleware/errorHandler');

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('notFoundHandler', () => {
  it('responds 404 with a JSON error body', () => {
    const res = createMockRes();
    notFoundHandler({}, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });
});

describe('errorHandler', () => {
  it('responds 400 for a raw SyntaxError from body parsing', () => {
    const res = createMockRes();
    errorHandler(new SyntaxError('Unexpected token'), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Malformed JSON body', details: [] });
  });

  it('responds 400 for a body-parser entity.parse.failed error that is not a SyntaxError instance', () => {
    const res = createMockRes();
    const err = new Error('parse failed');
    err.type = 'entity.parse.failed';
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("responds with the error's own status for a generic error", () => {
    const res = createMockRes();
    const err = new Error('teapot');
    err.status = 418;
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('defaults to 500 for a generic error with no status', () => {
    const res = createMockRes();
    errorHandler(new Error('boom'), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
