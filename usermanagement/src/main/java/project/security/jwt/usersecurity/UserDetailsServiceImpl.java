package project.security.jwt.usersecurity;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import project.models.UserEntity;
import project.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsernameOrEmail(username,username).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with username: " + username
                ));
        UserPrinciple userPrinciple= UserPrinciple.build(user);
        return userPrinciple;
    }
}
