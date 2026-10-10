import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider=({children})=>{
    const [userEmail,setUserEmail]=useState("")
    const [resetCode,setResetCode]=useState("")

    return(
        <AuthContext.Provider value={{userEmail,setUserEmail,resetCode,setResetCode}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth =()=>useContext(AuthContext)