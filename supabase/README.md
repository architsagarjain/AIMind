# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration:

   ```bash
   # with the CLI
   supabase link --project-ref <your-ref>
   supabase db push
   ```

   Or open the SQL editor and paste `migrations/0001_init.sql`.

3. Copy the credentials into `.env.local`:

   | Variable | Where to find it |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → `anon` `public` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` (**server only**) |

## Security posture

RLS is enabled on all three tables with **no permissive policies**. The anon key
therefore cannot read or write anything, which is what makes it safe to expose
in the client bundle. Every write happens server-side in `/api/chat` using the
service-role key, which bypasses RLS.

If you later add an admin dashboard, add a policy scoped to an authenticated
admin role — do not loosen the anon role.

## Cost note

The app works with Supabase entirely unconfigured. `getSupabaseAdmin()` returns
`null` and all persistence calls become no-ops, so you can ship without it and
add it later.
