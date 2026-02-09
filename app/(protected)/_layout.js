import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { AuthContext } from "@/config/authcontest";


  // export  const unstableSettings = {
  //   initialRouteName: "(tabs)"
  // }

    
export default function Protected() {
const authState = useContext(AuthContext)

if(!authState.isReady){
  return null
}

  if(!authState.isLoggedIn){
    return <Redirect href={"/login"}/>
  }
  return (
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
  );
}


