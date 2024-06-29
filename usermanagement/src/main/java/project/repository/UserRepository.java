package project.repository;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.models.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer > {

    Optional<UserEntity> findByUsernameOrEmail(String username,String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

}
