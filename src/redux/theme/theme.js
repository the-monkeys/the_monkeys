const initialState = {
    theme: 'light',
};

export const changeTheme = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_THEME':
            return { ...state, theme: action.theme };
        default:
            return state;
    }
};