import { requestAccess } from "@stellar/freighter-api";

export type WalletConnection = { address: string };

export async function connectFreighter(): Promise<WalletConnection> {
  const response = await requestAccess();
  const result = response as unknown as { address?: string; error?: { message?: string } | string };
  if (result?.error) {
    const message = typeof result.error === "string" ? result.error : result.error.message;
    throw new Error(message || "Wallet connection was not approved.");
  }
  const address = result?.address;
  if (!address || typeof address !== "string") {
    throw new Error("Freighter did not return a public address. Make sure the extension is installed and unlocked.");
  }
  return { address };
}
