import style from "./actions/style"
import set from "lodash/set";

export const actions = {
    setState(state, { payload }) {
        set(state, payload.key, payload.value);
    },

};

export const initialState = {
    // document head
    document: {
        head: {
            title: "Topografo",
            description: "Peluche me la pelas",
            keywords: "web, react, create-react-app",
            author: "Rolando Taipe",
        },
    },
    // actions
    style:style,

};
