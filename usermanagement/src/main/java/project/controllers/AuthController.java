package project.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import project.dto.AuthResponseDTO;
import project.dto.LoginDto;
import project.dto.MessageResponse;
import project.models.Role;
import project.models.UserEntity;
import project.repository.UserRepository;
import project.security.jwt.JwtProvider;
import project.security.jwt.usersecurity.UserPrinciple;
import project.service.UserService;

import java.util.HashMap;
import java.util.Map;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/auth")
    //@CrossOrigin(origins = "http://localhost:4200")
    public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final PasswordEncoder passwordEncoder;
        private final JwtProvider jwtProvider;
        private final UserRepository userRepository;

        private final UserService userService;





   /* @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        var account = userRepository.findByUsernameOrEmail(loginDto.getUsername(), loginDto.getUsername()).orElse(null);
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );
        assert account != null;
        var jwtToken = jwtProvider.generateToken(UserPrinciple.build(account));

        return ResponseEntity.ok(new MessageResponse(jwtToken));
    } */


        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
            // Récupérer l'utilisateur par son nom d'utilisateur ou email
            var account = userRepository.findByUsernameOrEmail(loginDto.getUsername(), loginDto.getUsername()).orElse(null);

            // Vérifier si l'utilisateur existe
            if (account == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect");
            }

            // Vérifier si l'utilisateur est bloqué
            if (account.isBlocked()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Votre compte est bloqué. Contactez l'administrateur pour plus d'informations.");
            }

            // Authentifier l'utilisateur
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginDto.getUsername(),
                                loginDto.getPassword()
                        )
                );
            } catch (AuthenticationException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect");
            }

            // Générer le token JWT
            String jwtToken = jwtProvider.generateToken(UserPrinciple.build(account));

            // Récupérer le rôle à partir du token JWT
            String role = jwtProvider.getRoleFromJwt(jwtToken);
            System.out.println("Rôle :" + role);

            // Retourner le token JWT et le rôle dans la réponse
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", jwtToken);
            response.put("role", role);

            return ResponseEntity.ok(response);
        }







//    @PostMapping("/registre")
//    public ResponseEntity<?> registre(@RequestBody UserEntity userEntity) {
//        if(userRepository.existsByEmail(userEntity.getEmail())){
//            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
//        }
//        if(userRepository.existsByUsername(userEntity.getUsername())){
//            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
//        }
//        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
//        userRepository.save(userEntity);
//        return ResponseEntity.ok("User registered successfully!");
//    }

  /* @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserEntity userEntity) {
        if (userRepository.existsByUsername(userEntity.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(userEntity.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
        }
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userRepository.save(userEntity);

        // Authentifier l'utilisateur
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userEntity.getUsername(), userEntity.getPassword())
        );

        // Générer le token JWT
        String token = jwtProvider.generateToken((UserPrinciple) authentication.getPrincipal());

        // Renvoyer le token au client
        return ResponseEntity.ok(token);
    }*/


        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody UserEntity userEntity) {
            try {
                if (userRepository.existsByUsername(userEntity.getUsername())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
                }
                if (userRepository.existsByEmail(userEntity.getEmail())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
                }

                // Encode the password before saving it to the database
                userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));

                // Set default role to USER
                userEntity.setRole(Role.SIMPLEU);
                userEntity.setBlocked(false);

                // Save the user to the database
                UserEntity savedUser = userRepository.save(userEntity);

                // Convert UserEntity to UserPrinciple
                UserPrinciple userPrinciple = UserPrinciple.build(savedUser);

                // Generate JWT token for the registered user
                String token = jwtProvider.generateToken(userPrinciple);
                System.out.println(savedUser);

                // Return the JWT token and user details to the client
                return ResponseEntity.ok(new AuthResponseDTO(token, savedUser));
            } catch (RuntimeException e) {
                // If an exception occurs, it may mean that the user already exists
                return ResponseEntity.badRequest().body(new MessageResponse("Failed to register user: " + e.getMessage()));
            }
        }

        @PutMapping("/{id}")
        public UserEntity updateUserPut(@PathVariable Integer id , @RequestBody UserEntity user)
        {
            return userService.updateUser(id,user);
        }

}