try {
  const err = new Error('Test');
  (err as any).status = 503;
} catch(e){}
