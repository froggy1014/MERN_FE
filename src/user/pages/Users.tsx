import { LoadingSpinner } from '../../shared/components/UIElements';
import UsersList from '../components/UsersList';
import useGetUser from '../../shared/hooks/useGetUser';

function Users() {
  const { isLoading, data } = useGetUser();

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && data.users && <UsersList users={data.users} />}
    </>
  );
}

export default Users;
