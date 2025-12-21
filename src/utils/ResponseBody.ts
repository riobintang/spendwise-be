export type ResponseBody<T> = {
  data: T;
  status: "success" | "fail" | "error";
  message?: string;
};

export function successResponse(message: string, data: unknown) {
  return {
    status: "success",
    data,
    message,
  };
}

export function failResponse(message: string, data?: unknown) {
  return {
    status: "fail",
    message,
    data,
  };
}

export function errorResponse(message: string) {
  return {
    status: "error",
    message,
  };
}
