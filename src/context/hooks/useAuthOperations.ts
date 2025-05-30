
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useStoreActions } from './useStoreActions';

export const useAuthOperations = () => {
  const authState = useAuthState();
  const authActions = useAuthActions({
    ...authState,
    profile: authState.profile
  });
  const storeActions = useStoreActions({
    user: authState.user,
    setUserStore: authState.setUserStore
  });

  return {
    ...authState,
    ...authActions,
    ...storeActions
  };
};
