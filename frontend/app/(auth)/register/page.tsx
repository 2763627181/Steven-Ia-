import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Crear cuenta — Steven IA",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  return <RegisterForm plan={plan} />;
}
