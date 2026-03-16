"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    branding?: any;
    customFieldsDefinition?: any;
}

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    permissions: Record<string, boolean>;
    workspaceRole: string | null;
    refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { status } = useSession();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});
    const [workspaceRole, setWorkspaceRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshWorkspaces = async () => {
        if (status !== "authenticated") {
            setWorkspaces([]);
            setCurrentWorkspaceState(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch("/api/workspaces");
            
            if (res.status === 401) {
                // Session expired or user deleted after DB reset
                console.warn("Session invalid or user not found. Clearing workspaces.");
                setWorkspaces([]);
                setCurrentWorkspaceState(null);
                setIsLoading(false);
                return;
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Failed to fetch workspaces. Status:", res.status, res.statusText);
                if (errorData.error) console.error("Error Detail:", errorData.error);
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            setWorkspaces(data.workspaces || []);

            // Set first workspace if none selected
            if (data.workspaces && data.workspaces.length > 0 && !currentWorkspace) {
                // Try to load from localStorage first
                const savedId = localStorage.getItem("lastWorkspaceId");
                const savedWorkspace = data.workspaces.find((w: Workspace) => w.id === savedId);
                setCurrentWorkspaceState(savedWorkspace || data.workspaces[0]);
            }
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            // Don't show toast on initial load error to prevent spam
        } finally {
            setIsLoading(false);
        }
    };

    const setCurrentWorkspace = (workspace: Workspace | null) => {
        setCurrentWorkspaceState(workspace);
        if (workspace) {
            localStorage.setItem("lastWorkspaceId", workspace.id);
        } else {
            localStorage.removeItem("lastWorkspaceId");
        }
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!currentWorkspace?.id || status !== "authenticated") {
                setPermissions({});
                setWorkspaceRole(null);
                return;
            }

            try {
                const res = await fetch(`/api/workspaces/${currentWorkspace.id}/my-permissions`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setPermissions(data.permissions || {});
                    setWorkspaceRole(data.role || null);
                }
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };

        fetchPermissions();
    }, [currentWorkspace?.id, status]);

    useEffect(() => {
        refreshWorkspaces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // Handle dynamic branding colors
    useEffect(() => {
        if (currentWorkspace?.branding?.primaryColor) {
            document.documentElement.style.setProperty('--brand-primary', currentWorkspace.branding.primaryColor);
        } else {
            // Default color if no branding exists
            document.documentElement.style.setProperty('--brand-primary', '#8B5CF6');
        }
    }, [currentWorkspace?.branding?.primaryColor]);

    return (
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, setCurrentWorkspace, refreshWorkspaces, isLoading, permissions, workspaceRole }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}
