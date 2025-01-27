export const sendOkResponse = async (res, payload) => {
  res.status(200).end(JSON.stringify(payload));
};
