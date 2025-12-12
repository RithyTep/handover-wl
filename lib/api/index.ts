/**
 * API Utilities
 * Re-exports all API-related utilities for convenient imports
 *
 * Usage:
 *   import { apiSuccess, apiError, handleApiError, badRequest } from "@/lib/api"
 */

export {
	apiSuccess,
	apiError,
	badRequest,
	unauthorized,
	notFound,
	conflict,
	serverError,
	handleApiError,
	withErrorHandling,
	type ApiResponse,
} from "./response"
