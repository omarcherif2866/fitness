package project.service;
import project.models.UserEntity;
import java.util.List;
import java.util.Set;

public interface UserService {
    UserEntity adduser(UserEntity users);
    void deleteUserEntityById(Integer id);
    UserEntity getUserById(Integer id);

    public List<UserEntity> getAllUsers();

    boolean existByEmail(String email);


    UserEntity updateUser(Integer id, UserEntity user);

    UserEntity registerNewUser(UserEntity newUser);

    void blockUser(Integer userId);
    void unblockUser(Integer userId);

}



