import React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import get from "lodash/get";
import { findAll, findOne, setState } from "./actions/utils"


const ReduxInitializer = ({ actions, children }) => {
    const dispatch = useDispatch();
    dispatch(actions.setter({ keys: "actions", value: actions }));
    return children;
};

const createReduxStore = ({ initialState, actions, children }) => {
    const Slice = createSlice({
        name: "state",
        initialState,
        reducers: { ...actions, setter: setState },
    });

    const store = configureStore({
        reducer: Slice.reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    });
    const utils = {
        dispatch: (action) => store.dispatch(action),
        getState: store.getState,
        set: ({ key, value }) => utils.dispatch(Slice.actions.setState({ key, value })),
        get: (key) => get(store.getState(), key),
        findAll: (key) => findAll(store.getState(), key),
        findOne: (key) => findOne(store.getState(), key),

    }

    return (
        <Provider store={store}>
            <ReduxInitializer actions={{ ...Slice.actions, ...utils }} >
                {children}
            </ReduxInitializer>
        </Provider>
    );
};

export default createReduxStore;



