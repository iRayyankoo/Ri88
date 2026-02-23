import { signOut } from "@/auth";

export async function GET() {
    await signOut({ redirectTo: "https://www.ri88.info" });
}

export async function POST() {
    await signOut({ redirectTo: "https://www.ri88.info" });
}
