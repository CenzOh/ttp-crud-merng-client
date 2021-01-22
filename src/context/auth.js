import React, {useReducer, createContext } from 'react' 
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

if(localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))
    // const ttoken is local var. toekn has experiation date so check to see if its expired by decoding it
    if(decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken')
    } else {
        // not expired, logged in
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    // initialize
    user: null,
    login: (userData) =>{},
    logout: () => {}
})

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state, 
                //spread the existing state
                user: action.payload
            }

            case 'LOGOUT':
                return {
                    ...state,
                    user: null
                }
        
        default:
            return state;
    }
}

function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem("jwtToken", userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem('jwtToken');
        dispatch({ type: 'LOGOUT'});
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout}}
            { ...props}
            />
    )
}

export { AuthContext, AuthProvider }