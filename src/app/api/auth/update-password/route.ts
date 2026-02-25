import { NextRequest, NextResponse } from "next/server";
import { updatePassword } from "@/actions/reset-password";

export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: "الرمز وكلمة المرور الجديدة مطلوبان!" },
                { status: 400 }
            );
        }

        const res = await updatePassword(token, newPassword);

        return NextResponse.json(res);
    } catch (error) {
        console.error("Update Password API Error:", error);
        return NextResponse.json(
            { error: "حدث خطأ داخلي في الخادم" },
            { status: 500 }
        );
    }
}
