package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.models.Cours;
import project.models.JourSemaine;
import project.repository.CoursRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class ICoursServiceImp implements ICoursService{

    private final CoursRepository coursRepository;
    @Override
    public Cours addCours(Cours cours) {
        return coursRepository.save(cours);
    }

    @Override
    public void deleteCours(Long id) {
        coursRepository.deleteById(id);
    }
    @Override
    public Cours updateCours(Long id, Cours cours) {
        Cours existingCours = coursRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cours not found"));

        existingCours.setNom(cours.getNom());
        existingCours.setImage(cours.getImage());
        existingCours.setDates(cours.getDates());
        existingCours.setHeures(cours.getHeures());

        return coursRepository.save(existingCours);
    }

    @Override
    public Cours getCoursById(Long id) {
        return coursRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("cours not found"));
    }

    @Override
    public Set<Cours> getAllCours() {
        List<Cours> coursList = coursRepository.findAll();
        return new HashSet<>(coursList);
    }

    @Override
    public List<Cours> getCoursByDates(JourSemaine jour) {
        return coursRepository.findByDatesContainingIgnoreCase(jour);
    }
}
