export const UPDATE_LAST_BLOCK = "UPDATE_LAST_BLOCK"

const reducer = (state= initialState, action) => {
  switch (action.type) {
    case UPDATE_LAST_BLOCK:
      return Object.assign({}, state, {
        lastBlock: action.lastBlock,
      })
    default:
      return state
  }
}

const initialState = {
  lastBlock: 0
}

export default reducer