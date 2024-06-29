package project.service;
import org.springframework.security.crypto.password.PasswordEncoder;
import project.models.Coach;
import project.models.UserEntity;
import project.repository.UserRepository;
import project.security.jwt.JwtProvider;
import project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserEntity updateUser(Integer id, UserEntity user){
        UserEntity existingUSer = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        existingUSer.setUsername(user.getUsername());
        existingUSer.setPhone(user.getPhone());
        existingUSer.setBirthdate(user.getBirthdate());
        existingUSer.setEmail(user.getEmail());

        return userRepository.save(existingUSer);
    }




    @Override
    public UserEntity adduser(UserEntity users) {
        return userRepository.save(users);
    }

    @Override
    public void deleteUserEntityById(Integer id) {
        userRepository.deleteById(id);

    }


    @Override
    public UserEntity getUserById(Integer id) {
        Optional<UserEntity> userOptional = userRepository.findById(id);
        return userOptional.orElse(null);
    }



    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }


    @Override
    public boolean existByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserEntity registerNewUser(UserEntity newUser) {
        // Vérifier si un utilisateur avec le même nom d'utilisateur ou la même adresse e-mail existe déjà
        if (userRepository.existsByUsername(newUser.getUsername()) || userRepository.existsByEmail(newUser.getEmail())) {
            throw new RuntimeException("User already exists.");
        }

        // Encoder le mot de passe avant de l'enregistrer dans la base de données
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // Enregistrer l'utilisateur dans la base de données
        UserEntity savedUser = userRepository.save(newUser);

        return savedUser;
    }


    @Override
    public void blockUser(Integer userId) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            user.setBlocked(true);
            userRepository.save(user);
        });
    }

    @Override
    public void unblockUser(Integer userId) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            user.setBlocked(false);
            userRepository.save(user);
        });
    }

}
