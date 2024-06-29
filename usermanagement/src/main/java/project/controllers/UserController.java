package project.controllers;
import project.models.UserEntity;
import project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<UserEntity> addUser(@RequestBody UserEntity user) {

        return ResponseEntity.ok( userService.adduser(user));
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Integer id) {
        userService.deleteUserEntityById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUser(@PathVariable("id") Integer id) {
        UserEntity user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }



    @PutMapping("/block/{userId}")
    public ResponseEntity<Void> blockUser(@PathVariable Integer userId) {
        userService.blockUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/unblock/{userId}")
    public ResponseEntity<Void> unblockUser(@PathVariable Integer userId) {
        userService.unblockUser(userId);
        return ResponseEntity.ok().build();
    }


}
