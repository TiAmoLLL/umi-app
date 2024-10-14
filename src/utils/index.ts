import JSEncrypt from 'jsencrypt';

/**
 * 加密
 * @param {*} value 要加密的字符串
 */
// const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcKv/egiS7sozK3HLWNJTa5UyL1IpI9G145k62OrK8MxgPR4gurGj58Dq8q8E6gMv0EwpylvxHnqciZeta+MJSE1NLD2wmO7oD2w9oN3KMBz6aH2+ESTkH1fhD5Szpw662Gwj/GemIQ+j+p5bX0cS9JMj/zRl+wlGojIl2bIUzFQIDAQAB';
const publicKey = 'gagagasgklagjakljgakgjoaigagmaskggkgjiagakgajg';
export function encrypt(value) {
  if (value === null || value === '') return null;
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encodeURIComponent(encrypt.encrypt(value));
}
