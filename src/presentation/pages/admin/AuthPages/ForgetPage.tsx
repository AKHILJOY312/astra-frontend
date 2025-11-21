import PageMeta from "@/presentation/components/admin/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "@/presentation/components/admin/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta title="Admin SignIn Dashboard " description="" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
