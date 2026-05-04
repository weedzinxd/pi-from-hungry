export interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

export interface PiInitOptions {
  version: string;
  sandbox?: boolean;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
}

export interface PiSdk {
  init: (options: PiInitOptions) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: unknown) => void
  ) => Promise<PiAuthResult>;
  createPayment?: (
    payment: PiPaymentData,
    callbacks: {
      onReadyForServerApproval?: (paymentId: string) => void;
      onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
      onCancel?: (paymentId: string) => void;
      onError?: (error: unknown, payment?: unknown) => void;
    }
  ) => void;
}

declare global {
  interface Window {
    Pi?: PiSdk;
  }
}
