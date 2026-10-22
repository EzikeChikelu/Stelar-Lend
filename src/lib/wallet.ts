import { isConnected, requestAccess } from "@stellar/freighter-api";

export type WalletConnection = { address: string };

export async function connectFreighter(): Promise<WalletConnection> {
  const availability = await isConnected();
  if (availability.error) {
    throw new Error(availability.error.message || "Could not check Freighter availability.");
  }
  if (!availability.isConnected) {
    throw new Error("Freighter is not detected. Install or unlock the Stellar wallet extension, then try again.");
  }

  const response = await requestAccess();
  if (response.error) {
    throw new Error(response.error.message || "Wallet connection was not approved.");
  }
  if (!response.address) {
    throw new Error("Freighter did not return a public address. Please unlock the extension and try again.");
  }
  return { address: response.address };
}
