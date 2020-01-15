export const createRequestTypes = (type: string) => ({
  REQUEST: `${type}_REQUEST`,
  SUCCESS: `${type}_SUCCESS`,
  FAILURE: `${type}_FAILURE`,
  INTERNAL: `${type}_INTERNAL`,
})

export const actionCreator = {
  request: (type: ReturnType<typeof createRequestTypes>) => ({
    type: type.REQUEST,
  }),
  success: (type: ReturnType<typeof createRequestTypes>, payload?: any) => ({
    type: type.SUCCESS,
    payload,
  }),
  internal: (type: ReturnType<typeof createRequestTypes>, payload?: any) => ({
    type: type.INTERNAL,
    payload,
  }),
  failure: (
    type: ReturnType<typeof createRequestTypes>,
    errorMessage: string,
  ) => ({ type: type.FAILURE, errorMessage }),
}
