// Use local backend API
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'

export interface ApiError {
  error: string
}

// Utility for handling API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'An error occurred'
  
  try {
    const errorData = await response.json()
    // API returns error in 'error' field
    errorMessage = errorData.error || errorMessage
  } catch {
    // If response is not JSON, use status text
    errorMessage = `HTTP ${response.status}: ${response.statusText}`
  }
  
  throw new Error(errorMessage)
}

// Utility for making HTTP requests
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      await handleApiError(response)
    }

    return response.json()
  } catch (error) {
    // Handle network errors, CORS issues, etc.
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Network error: Unable to reach the server. Please check your internet connection or try again later.'
      )
    }
    // Re-throw other errors
    throw error
  }
}

export default fetchApi
