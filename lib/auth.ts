import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


import { dash } from "@better-auth/infra";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: ["https://enactable-unstoried-lizbeth.ngrok-free.app", "https://cosmetics-lil-owners-statutes.trycloudflare.com"],
    plugins: [
        dash()
    ]
});
