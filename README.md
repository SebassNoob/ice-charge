# ice-charge

All-in-one boilerplate for a modern web application.

Stack: NextJS 14, Lucia 3, Tailwind 3, Mantine 7, Prisma 5

## currently temporarily patched

- next@14.2 does not support useActionState (14.3 has support); useFormState is used from an older canary
- next@14.2 does not support node esm external modules https://github.com/vercel/next.js/issues/60756; wait for 14.3
- many packages rely on react ^18 which will conflict with react@19
- next@14.2 unable to use @types/react@19 https://github.com/vercel/next.js/issues/65599
- bun@1.1.7 fails silently on prisma:generate in docker: https://github.com/prisma/prisma/issues/21241; installing node works
