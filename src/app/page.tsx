import React from "react";
import LandingPage from "@/components/LandingPage";
import LoggedInHomePage from "@/components/LoggedInHomePage";
import DashboardLayoutWrapper from "@/components/DashboardLayoutWrapper";
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function HomePage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const code = searchParams?.code;

    if (code && typeof code === 'string') {
        redirect(`/auth/callback?code=${code}`);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return (
            <DashboardLayoutWrapper>
                <LoggedInHomePage />
            </DashboardLayoutWrapper>
        );
    }

    return <LandingPage />;
}
