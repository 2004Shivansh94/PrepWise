import InterviewSelector from "@/components/InterviewSelector";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async ({ searchParams }: RouteParams) => {
  const user = await getCurrentUser();
  const { mode } = await searchParams;
  const initialMode = mode === "resume" ? "resume" : "standard";

  return (
    <>
      <h3 className="text-center w-full">Interview generation</h3>

      <InterviewSelector user={user} initialMode={initialMode} />
    </>
  );
};

export default Page;
