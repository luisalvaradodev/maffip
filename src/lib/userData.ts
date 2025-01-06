import { executeQuery } from '@/features/data/actions/db'

export async function getUserData(userId: string) {
    try {
      console.log('Fetching user data for ID:', userId); // Log del ID
  
      const userData = await executeQuery<any[]>(
        'SELECT id, login, expirado FROM auth WHERE id = ?',
        [userId]
      );
  
      console.log('User data result:', userData); // Log del resultado
  
      if (userData.length === 0) {
        return null;
      }
  
      return userData[0];
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  
