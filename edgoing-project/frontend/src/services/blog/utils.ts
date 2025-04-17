/**
 * u535au5ba2u5de5u5177u51fdu6570 - u7b80u5316u7248
 * u6ce8u610fuff1au8fd9u4e2au6587u4ef6u53eau5305u542bu540eu53f0u7ba1u7406u535au5ba2u65f6u9700u8981u7684u6700u5c0fu529fu80fd
 */

/**
 * u9a8cu8bc1APIu54cdu5e94
 */
export function validateResponse<T>(response: any, errorMessage: string): T {
  try {
    if (!response || !response.data) {
      console.error(errorMessage, 'u65e0u6548u7684u54cdu5e94u683cu5f0f');
      throw new Error(errorMessage);
    }
    return response.data as T;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
}
