import { configureGoogleSignIn } from "@/services/googleAuth";
import { Stack } from "expo-router";
import { useEffect } from "react";


export default function RootLayout() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  return <Stack />;
}
