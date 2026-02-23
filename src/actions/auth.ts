"use server";
import { signOut } from "@/auth";

export async function handleSignOut() {
    await signOut({ redirectTo: "https://www.ri88.info" });
}
