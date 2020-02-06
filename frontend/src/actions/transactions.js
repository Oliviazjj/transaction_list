import axios from 'axios';
import { GET_TRANSACTIONS, DELETE_TRANSACTION, ADD_TRANSACTION } from './types';
import {API_URL} from ".././constants"

// GET TRANSACTIONS
export const getTransactions = () => dispatch => {
  axios.get(API_URL)
    .then(res => {
      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data
      });
    }).catch(err => console.log(err));
}

// Delete TRANSACTIONS
export const deleteTransaction = (id) => dispatch => {
  axios.delete(`${API_URL}${id}/`)
    .then(res => {
      dispatch({
        type: DELETE_TRANSACTION,
        payload: res.data
      });
    }).catch(err => console.log(err));
}

// ADD TRANSACTIONS
export const addTransaction = (transaction) => dispatch => {
  axios.post(API_URL, transaction)
    .then(res => {
      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data
      });
    }).catch(err => console.log(err));
}