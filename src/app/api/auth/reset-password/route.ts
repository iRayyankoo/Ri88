import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/actions/reset-password";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "البريد الإلكتروني مطلوب!" },
                { status: 400 }
            );
        }

        const res = await resetPassword(email);

        return NextResponse.json(res);
    } catch (error) {
        console.error("Reset Password API Error:", error);
        return NextResponse.json(
            { error: "حدث خطأ داخلي في الخادم" },
            { status: 500 }
        );
    }
}
