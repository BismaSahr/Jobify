// SearchContext.js
import React, { createContext, useReducer, useContext } from 'react';
import ipv4 from '../components/ipv4';

const SearchStateContext = createContext();
const SearchDispatchContext = createContext();

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'CLEAR_JOBS':
      return { ...state, jobs: [] };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    default:
      return state;
  }
};

const initialState = {
  searchQuery: '',
  jobs: [],
  loading: false,
  refreshing: false,
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Modified getAllData to accept authToken
  const getAllData = async (query, authToken) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `http://${ipv4.ip}:3000/api/jobs/search?query=${encodeURIComponent(query)}`,
        {
          headers: headers, // Pass the headers object
        }
      );
      const data = await response.json();

      if (data.status === 'Ok' && Array.isArray(data.data)) {
        dispatch({ type: 'SET_JOBS', payload: data.data });
      } else {
        dispatch({ type: 'SET_JOBS', payload: [] });
      }
    } catch (error) {
      console.error('An error occurred while fetching job data:', error);
      dispatch({ type: 'SET_JOBS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_REFRESHING', payload: false });
    }
  };

  return (
    <SearchStateContext.Provider value={state}>
      <SearchDispatchContext.Provider value={{ dispatch, getAllData }}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchStateContext.Provider>
  );
};

export const useSearchState = () => useContext(SearchStateContext);
export const useSearchDispatch = () => useContext(SearchDispatchContext);