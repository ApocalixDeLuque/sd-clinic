import { useSession } from "@/api/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthenticated() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.isAuth) {
      router.push("/");
    }
  }, [router, session.isAuth]);
}
