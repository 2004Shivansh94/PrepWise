import InterviewSelector from "@/components/InterviewSelector";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3 className="text-center w-full">Interview generation</h3>

      <InterviewSelector user={user} />
    </>
  );
};

export default Page;
