import GoogleSignIn from "./GoogleSignIn";
import GoogleSignOut from "./GoogleSignOut";
import SpotifySignIn from "./SpotifySignIn";
import SpotifySignOut from "./SpotifySignOut";

const clientID =
  "170771151462-8im6g61eldsjhl4f1qbv5bf70gg5q76e.apps.googleusercontent.com";
const googleScopes =
  "profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit";

interface Auth {
  accessToken: string;
  setAccessToken: Function;
  spotifyToken: string;
  setSpotifyToken: Function;
  spotifyRedirect: string;
}

const AuthWrapper = ({
  accessToken,
  setAccessToken,
  spotifyToken,
  setSpotifyToken,
  spotifyRedirect,
}: Auth) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
      }}
    >
      <p>DigAssist</p>
      <div>
        {accessToken !== "" ? (
          <GoogleSignOut
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            scopes={googleScopes}
          />
        ) : (
          <GoogleSignIn scopes={googleScopes} setAccessToken={setAccessToken} />
        )}
        {spotifyToken !== null ? (
          <SpotifySignOut
            spotifyToken={spotifyToken}
            setSpotifyToken={setSpotifyToken}
          />
        ) : (
          <SpotifySignIn
            spotifyToken={spotifyToken}
            setSpotifyToken={setSpotifyToken}
            redirectURI={spotifyRedirect}
          />
        )}
      </div>
    </div>
  );
};

export default AuthWrapper;
