import { Router } from "expo-router";

export const handleGameRedirect = (
  gameId: string,
  router: Router,
  setRedirecting: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setRedirecting(true);
  router.push(`/game/${gameId}`);
  setTimeout(() => setRedirecting(false), 1000);
};
