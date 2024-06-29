package project.models;

        import jakarta.persistence.*;
        import lombok.*;


        import java.time.LocalDate;
        import java.util.ArrayList;
        import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;



    private String username;
    private String email;
    private String password;
    //private String confirmpassword;
    private String phone;
    private boolean blocked = false; // Ajout de la propriété de blocage

    @Enumerated(EnumType.STRING)
    Role role ;
    //private boolean action=false;

    private LocalDate birthdate;


    @OneToMany(mappedBy = "user")
    private List<Reservation> reservations = new ArrayList<>();


   // @ManyToMany(mappedBy = "users")
   // private List<Coach> coaches;


}
