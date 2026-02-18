import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export class RegistrationController {
  async register(req: Request, res: Response, next: NextFunction) {
    const { 
      email, 
      password, 
      fullName, 
      dateOfBirth, 
      countryId, 
      nationality, 
      documentType, 
      documentNumber, 
      role 
    } = req.body;

    let createdUserId: string | null = null;

    try {
      // 1. Identity Service: Create credentials
      const identityResponse = await axios.post(`${process.env.IDENTITY_SERVICE_URL}/auth/register`, {
        email,
        password,
        role
      });

      // Extracting ID from your standardized successResponse structure
      createdUserId = identityResponse.data.data.id;

      console.log(`[BFF] Identity created: ${createdUserId}`);

      // 2. Profile Service: Create full profile
      await axios.post(`${process.env.PROFILE_SERVICE_URL}/create`, {
        userId: createdUserId,
        fullName,
        dateOfBirth,
        countryId,
        nationality,
        documentType,
        documentNumber
      });

      // Standardized Success Response
      return res.status(201).json({
        success: true,
        message: 'User and Profile created successfully',
        data: { userId: createdUserId }
      });

    } catch (error: any) {
      const errorData = error.response?.data;
      const statusCode = error.response?.status || 500;

      console.error('[BFF] Orchestration failed:', errorData || error.message);

      // 3. ROLLBACK Logic
      if (createdUserId) {
        await this.rollbackIdentity(createdUserId);
      }

      // Return standardized error response following your @org/errors pattern
      return res.status(statusCode).json({
        success: false,
        message: errorData?.message || 'Failed to process full registration',
        code: errorData?.code || 'REGISTRATION_ORCHESTRATION_ERROR',
        details: errorData?.details || null
      });
    }
  }

  private async rollbackIdentity(userId: string) {
    console.warn(`[ROLLBACK] Deleting user ${userId} from Identity Service...`);
    try {
      // Ensure the DELETE route in Identity is accessible (check the /auth or /users prefix)
      await axios.delete(`${process.env.IDENTITY_SERVICE_URL}/users/${userId}`);
      console.log(`[ROLLBACK] Successfully removed inconsistent user: ${userId}`);
    } catch (rollbackError: any) {
      console.error('[CRITICAL] Identity rollback failed!', rollbackError.response?.data || rollbackError.message);
    }
  }
}