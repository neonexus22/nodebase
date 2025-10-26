import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{ credentialId: string }>
}

const CredentialDetails = async ({ params }: PageProps) => {
    await requireAuth();
    const { credentialId } = await params;
    return (
        <div>Credential Id: {credentialId}</div>
    )
}

export default CredentialDetails