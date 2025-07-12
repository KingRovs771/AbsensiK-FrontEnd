/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Role {
  role_id: string;
  name_role: string;
  description: string;
}

interface AuthInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  role: Role;
  [key: string]: any;
}

const useAuth = (): AuthInfo | null => {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchAuthInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token Not Found");
          router.push("auth/signin");
          return;
        }

        const AuthResponse = await fetch(
          "http://localhost:8080/v1/auth/getInfo",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!AuthResponse.ok) {
          throw new Error(`HTTP Error! Status : ${AuthResponse.status}`);
        }

        const data = await AuthResponse.json();

        if (!data || data.fullName) {
          console.warn("User Data Not Found, redirecting to login");
          router.push("/auth/signin");
          return;
        }

        setAuthInfo({
          fullName: data.fullName || "",
          email: data.email || "",
          role: data.role || "",
          ...data,
        });
      } catch (error) {
        console.error("Failed to Fetch Role: ", error);
        setAuthInfo(null);
      }
    };
    fetchAuthInfo();
  }, [router]);
  return authInfo;
};

export default useAuth;
