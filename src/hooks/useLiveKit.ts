import { useState, useEffect } from "react";
import { getMeetingToken } from "@/services/meetings.service";

export function useMeetingToken(code: string) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await getMeetingToken(code);
        const { token, serverUrl } = res.data.data;
        setToken(token);
        setServerUrl(serverUrl);
      } catch (err) {
        console.error("Failed to get LiveKit token", err);
      }
    }
    if (code) fetchToken();
  }, [code]);

  return { token, serverUrl };
}
