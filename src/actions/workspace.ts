"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const updateWorkspaceSettings = async (
    workspaceId: string,
    data: {
        branding?: any;
        customFieldsDefinition?: any;
    }
) => {
    const user = await currentUser();

    if (!user) {
        return { error: "غير مصرح لك بالقيام بهذا الإجراء" };
    }

    try {
        // Check if user has permission (ADMIN or OWNER in the workspace)
        const membership = await db.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: user.id,
                role: { in: ['ADMIN', 'OWNER'] }
            }
        });

        if (!membership && user.role !== 'ADMIN') {
            return { error: "ليس لديك صلاحية لتعديل إعدادات مساحة العمل" };
        }

        const updatedWorkspace = await db.workspace.update({
            where: { id: workspaceId },
            data: {
                branding: data.branding !== undefined ? data.branding : undefined,
                customFieldsDefinition: data.customFieldsDefinition !== undefined ? data.customFieldsDefinition : undefined,
            }
        });

        revalidatePath("/pro/settings");
        revalidatePath("/pro/crm");

        return { success: "تم تحديث إعدادات مساحة العمل بنجاح", workspace: updatedWorkspace };
    } catch (error) {
        console.error("[UPDATE_WORKSPACE_SETTINGS]", error);
        return { error: "حدث خطأ أثناء تحديث الإعدادات" };
    }
};
