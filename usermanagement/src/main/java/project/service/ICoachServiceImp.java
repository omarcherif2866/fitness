package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.models.Coach;
import project.models.Cours;
import project.models.JourSemaine;
import project.repository.CoachRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
@RequiredArgsConstructor
@Service
public class ICoachServiceImp implements ICoachService{
    private final CoachRepository coachRepository;

    @Override
    public Coach addCoach(Coach coach) {
        return coachRepository.save(coach);
    }

    @Override
    public void deleteCoach(Long id) {
        coachRepository.deleteById(id);

    }

    @Override
    public Coach updateCoach(Long id, Coach coach) {
        Coach existingCoach = coachRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coach not found"));

        existingCoach.setNom(coach.getNom());
        existingCoach.setImage(coach.getImage());
        existingCoach.setPrenom(coach.getPrenom());
        existingCoach.setSpecialite(coach.getSpecialite());
        existingCoach.setDates(coach.getDates());
        existingCoach.setHeures(coach.getHeures());
        return coachRepository.save(existingCoach);
    }

    @Override
    public Coach getCoachById(Long id) {
        return coachRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("coach not found"));    }

    @Override
    public Set<Coach> getAllCoach() {
        List<Coach> coachList = coachRepository.findAll();
        return new HashSet<>(coachList);
    }

    @Override
    public List<Coach> getCoachByDates(JourSemaine jour) {
        return coachRepository.findByDatesContainingIgnoreCase(jour);
    }
}
