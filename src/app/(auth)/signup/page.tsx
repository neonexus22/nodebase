import RegisterForm from '@/features/auth/components/register-form'
import { requireUnauth } from '@/lib/auth-utils'

const RegisterPage = async () => {
    await requireUnauth();
    return (
        <RegisterForm />
    )
}

export default RegisterPage