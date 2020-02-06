import { GET_TRANSACTIONS, DELETE_TRANSACTION, ADD_TRANSACTION} from '../actions/types.js';
import { actions } from 'react-table';

const initialState = {
  transactions: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_TRANSACTIONS:
      return {
        ...state,  // using spread operator to send whatever else in the state
        transactions: action.payload
      };

    case DELETE_TRANSACTION: 
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id != action.payload.id)
      };
    
    case ADD_TRANSACTION: 
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };

    default:
      return state;

  }
}