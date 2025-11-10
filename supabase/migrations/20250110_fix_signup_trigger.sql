-- Fix the handle_new_user function to properly bypass RLS
create or replace function public.handle_new_user()
returns trigger 
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'owner'::user_role)
  );
  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', sqlerrm;
    return new;
end;
$$;

-- Recreate the trigger (in case it doesn't exist or needs updating)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
