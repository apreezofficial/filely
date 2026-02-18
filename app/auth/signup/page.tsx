import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)',
            padding: '2rem'
        }}>
            <SignupForm />
        </div>
    );
}

