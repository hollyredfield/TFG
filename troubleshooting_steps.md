# Database Connection Troubleshooting Steps

When encountering the error "Failed to retrieve columns for table":

1. **Refresh your browser** - As suggested in the error message, this may resolve temporary connection issues

2. **Check database connection**:
   - Verify the database service is running
   - Confirm your credentials haven't expired
   - Test if other tables can be accessed

3. **Clear browser cache and cookies**:
   - This can help if there's a stale session or cached data issue

4. **Run a simple query to verify connection**:
   ```sql
   SELECT * FROM public.ofertas LIMIT 1;
   ```

5. **Check if the table exists**:
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_schema = 'public'
     AND table_name = 'ofertas'
   );
   ```

6. **Restart your database client application**

7. **If using Supabase or similar services**:
   - Check the service status page for outages
   - Try accessing from a different network

If all else fails, contact the support team as mentioned in the error message.
