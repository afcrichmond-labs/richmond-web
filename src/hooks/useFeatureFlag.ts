import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { useUser } from "./useUser";

export function useFeatureFlag(flagKey: string): boolean {
  const flags = useFlags();
  return flags[flagKey] ?? false;
}

export function useFeatureFlagWithDetails(flagKey: string) {
  const flags = useFlags();
  const client = useLDClient();
  const user = useUser();

  return {
    enabled: flags[flagKey] ?? false,
    variation: client?.variation(flagKey, false),
    user: user?.id,
  };
}
