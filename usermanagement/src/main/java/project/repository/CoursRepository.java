package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.models.Cours;
import project.models.JourSemaine;

import java.util.List;

public interface CoursRepository extends JpaRepository<Cours,Long > {
    List<Cours> findByDatesContainingIgnoreCase(JourSemaine jour);

}
