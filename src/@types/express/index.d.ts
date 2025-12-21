declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

export {};
