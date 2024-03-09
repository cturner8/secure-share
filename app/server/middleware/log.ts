export default defineEventHandler((event) => {
  console.log(`[Request]: ${getRequestURL(event)}`);
});
