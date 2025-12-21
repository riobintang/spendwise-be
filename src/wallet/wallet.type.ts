import { Decimal } from "@prisma/client/runtime/library";

export interface Wallet {
  id: number;
  name: string;
  type: "cash" | "bank" | "e_wallet";
  balance: Decimal;
  currency: string;
  userId: number;
}

export interface WalletCreateInput {
  name: string;
  type: "cash" | "bank" | "e_wallet";
  currency: string;
}

export interface WalletUpdateInput {
  name?: string;
  type?: "cash" | "bank" | "e_wallet";
  currency?: string;
}
