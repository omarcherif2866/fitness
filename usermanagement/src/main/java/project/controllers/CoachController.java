package project.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.models.Coach;
import project.models.Cours;
import project.models.JourSemaine;
import project.service.FileStorageException;
import project.service.FileStorageService;
import project.service.ICoachService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/coach")
@RequiredArgsConstructor
public class CoachController {

    private final ICoachService iCoachService;
    private final FileStorageService fileStorageService;

    @PostMapping()
    public ResponseEntity<?> addCoach(@RequestParam("nom") String nom,
                                      @RequestParam("prenom") String prenom,
                                      @RequestParam("specialite") String specialite,
                                      @RequestParam("image") MultipartFile imageFile,
                                        @RequestParam("dates") List<JourSemaine> dates,
                                      @RequestParam("heures") List<String> heures){
        try {
            // Validation des paramètres
            if (nom == null || nom.isEmpty() || imageFile.isEmpty() || prenom == null || prenom.isEmpty() || specialite == null || specialite.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid input parameters.");
            }

            // Stocker le fichier d'image
            String fileName = fileStorageService.storeFile(imageFile);

            Coach coach = new Coach();
            coach.setNom(nom);
            coach.setImage(fileName);
            coach.setPrenom(prenom);
            coach.setSpecialite(specialite);
            coach.setDates(dates);
            coach.setHeures(heures);

            Coach savedCoach = iCoachService.addCoach(coach);

            return ResponseEntity.ok(savedCoach);
        } catch (FileStorageException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error storing the file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request: " + e.getMessage());
        }
    }


    @GetMapping("{id}")
    public Coach getCoachById(@PathVariable Long id){
        return iCoachService.getCoachById(id);
    }

    @DeleteMapping("{id}")
    public void deleteCoach(@PathVariable Long id) { iCoachService.deleteCoach(id);}

    @GetMapping("/allCoach")
    public ResponseEntity<Set<Coach>> getAllCoach() {
        Set<Coach> coachss = iCoachService.getAllCoach();
        return ResponseEntity.ok(coachss);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coach> updateCoach(
            @PathVariable Long id,
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("specialite") String specialite,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "dates", required = false) List<String> dates,
            @RequestParam(value = "heures", required = false) List<String> heures) {
        try {
            Coach existingCoach = iCoachService.getCoachById(id);

            if (nom != null && !nom.isEmpty()) {
                existingCoach.setNom(nom);
            }
            if (prenom != null && !prenom.isEmpty()) {
                existingCoach.setPrenom(prenom);
            }
            if (specialite != null && !specialite.isEmpty()) {
                existingCoach.setSpecialite(specialite);
            }
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
                String imagePath =  fileName;
                Path path = Paths.get("images/");
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }
                Files.copy(imageFile.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                existingCoach.setImage(imagePath);
            }
            List<JourSemaine> jourSemaineList = null;
            if (dates != null) {
                jourSemaineList = dates.stream()
                        .map(JourSemaine::valueOf)
                        .collect(Collectors.toList());
            }

            existingCoach.setDates(jourSemaineList);
            if (heures != null) {
                // Traiter les heures ici
                existingCoach.setHeures(heures);
            }

            Coach updatedCoach = iCoachService.updateCoach(id, existingCoach);

            return ResponseEntity.ok(updatedCoach);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<UrlResource> getImage(@PathVariable String fileName) {
        // Load file as Resource
        Path filePath = fileStorageService.loadFileAsPath(fileName);
        UrlResource resource;
        try {
            resource = new UrlResource(filePath.toUri());
        } catch (Exception e) {
            throw new RuntimeException("File not found: " + fileName);
        }

        // Try to determine file's content type
        String contentType;
        try {
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            contentType = "application/octet-stream";
        }

        // For inline display, set content disposition
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDispositionFormData("inline", fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

    @GetMapping("/bydates/{jour}")
    public ResponseEntity<List<Coach>> getCoachByDates(@PathVariable JourSemaine jour) {
        List<Coach> coach = iCoachService.getCoachByDates(jour);
        return ResponseEntity.ok(coach);
    }
}
