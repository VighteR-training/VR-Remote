const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(delay + ' ' + timeoutScheduled);
}, 3000);