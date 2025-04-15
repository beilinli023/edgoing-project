/**
 * u535au5ba2APIu670du52a1 - u7b80u5316u7248
 * u6ce8u610fuff1au8fd9u4e2au6587u4ef6u53eau5305u542bu540eu53f0u7ba1u7406u535au5ba2u65f6u9700u8981u7684u6700u5c0fu529fu80fd
 */

// u521bu5efau4e00u4e2au7b80u5316u7684APIu5bf9u8c61
// u6240u6709u8bf7u6c42u90fdu4f1au8fd4u56deu9884u8bbeu7684u6570u636euff0cu56e0u4e3au5b9eu9645u7684APIu5df2u7ecfu88abu672cu5730u6570u636eu4ee3u66ff

const blogApi = {
  get: async (url: string) => {
    console.log('u6a21u62dfu535au5ba2APIu8bf7u6c42 GET:', url);
    return { data: [] };
  },
  post: async (url: string, data: any) => {
    console.log('u6a21u62dfu535au5ba2APIu8bf7u6c42 POST:', url, data);
    return { data: { id: 'local-' + Date.now() } };
  },
  put: async (url: string, data: any) => {
    console.log('u6a21u62dfu535au5ba2APIu8bf7u6c42 PUT:', url, data);
    return { data: { success: true } };
  },
  delete: async (url: string) => {
    console.log('u6a21u62dfu535au5ba2APIu8bf7u6c42 DELETE:', url);
    return { data: { success: true } };
  }
};

export default blogApi;
