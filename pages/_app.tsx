import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientID =
  "170771151462-8im6g61eldsjhl4f1qbv5bf70gg5q76e.apps.googleusercontent.com";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={clientID}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
