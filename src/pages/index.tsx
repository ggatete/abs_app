import { useEffect, useState } from "react";
import supabase from "../lib/helper/supabaseClient";
import AbsLogo from "../public/americanbatterysolutionslogo.png";
import MicrosoftLogo from "../public/microsoftlogo.webp";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log(error.message);
        return;
      } else {
        console.log("GET SESSION DATA: ", data);
        setUser(data.session?.user ?? null);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("SESSION", session);
        setUser(session?.user);
      }
    );

    return () => {
      console.log("AUTH_LISTENER", authListener);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email",
      },
    });

    if (error) {
      console.log("ERRORRR", error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {!user ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            padding: "100px",
          }}
        >
          <div
            style={{
              border: "1px solid black",
              borderRadius: "12px",
              padding: "50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "100px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Image src={AbsLogo} alt="American Battery Solutions Logo" />
              <div
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <h1 style={{ fontSize: 30 }}>
                  Welcome to American Battery Solutions
                </h1>
                <p>Login to access your account</p>
              </div>
            </div>
            <button type="button" onClick={handleLogin}>
              <div
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 18,
                  paddingLeft: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid black",
                  gap: "20px",
                }}
              >
                <Image
                  src={MicrosoftLogo}
                  alt="Microsoft Logo"
                  width={50}
                  height={50}
                />
                <p>Login with Microsoft</p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Authenticated {user.email}</h1>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
