import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord" // 1. Importa el nuevo proveedor
// PRÁCTICA: importa aquí el proveedor que vas a agregar, por ejemplo:
// import Twitch from "next-auth/providers/twitch";

/**
 * Lista de proveedores OAuth con los que se puede iniciar sesión.
 * Cada uno lee sus credenciales de variables de entorno:
 *   GitHub -> AUTH_GITHUB_ID y AUTH_GITHUB_SECRET
 *   Twitch -> AUTH_TWITCH_ID y AUTH_TWITCH_SECRET
 */
const providers: Provider[] = [
  GitHub,
  Discord // 2. Añádelo al array de proveedores
  // PRÁCTICA: agrega aquí tu proveedor, por ejemplo:
  // Twitch,
];

/** Lista simple (id y nombre) para dibujar un botón por cada proveedor en la página. */
export const providerList = providers.map((p) => {
  const provider = typeof p === "function" ? p() : p;
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: { signIn: "/", error: "/" },
  callbacks: {
    // Guardamos qué proveedor se usó para mostrarlo en la página.
    jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    session({ session, token }) {
      session.provider = token.provider as string | undefined;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    provider?: string;
  }
}
