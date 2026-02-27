declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      role: string;
      organizationId?: string;
      branchId?: string;
      zoneId?: string;
    };
  }
}