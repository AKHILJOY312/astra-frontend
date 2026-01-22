import PageMeta from "@/components/organisms/admin/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "@/components/organisms/admin/auth/SignInForm";

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
