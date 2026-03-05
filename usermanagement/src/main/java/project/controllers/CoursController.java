package project.controllers;

import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.models.Cours;
import project.models.JourSemaine;
import project.service.FileStorageException;
import project.service.FileStorageService;
import project.service.ICoursService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import project.service.CloudinaryService;

@RestController
@RequestMapping("/cours")
@RequiredArgsConstructor
public class CoursController {

    private final ICoursService iCoursService;
    private final FileStorageService fileStorageService;
    private final CloudinaryService cloudinaryService; // ← ajouté

    @PostMapping()
    public ResponseEntity<?> addCours(
            @RequestParam("nom") String nom,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("dates") List<JourSemaine> dates,
            @RequestParam("heures") List<String> heures) {

        try {
            // Validation des paramètres
            if (nom == null || nom.isEmpty() || image == null || image.isEmpty() || dates.isEmpty() || heures.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid input parameters.");
            }

            // Stocker le fichier d'image

            // Créer un nouveau cours
            Cours cours = new Cours();
            cours.setNom(nom);
            cours.setImage(fileName);
            cours.setDates(dates);
            cours.setHeures(heures);
              if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "fitness/cours");
                    cours.setImage(imageUrl);
                }
            // Sauvegarder le cours
            Cours savedCours = iCoursService.addCours(cours);

            // Retourner la réponse avec le cours sauvegardé
            return ResponseEntity.ok(savedCours);
        } catch (FileStorageException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error storing the file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request: " + e.getMessage());
        }
    }

    @GetMapping("{id}")
    public Cours getCoursById(@PathVariable Long id){
        return iCoursService.getCoursById(id);
    }

    @DeleteMapping("{id}")
    public void deleteCours(@PathVariable Long id) { iCoursService.deleteCours(id);}

    @GetMapping("/allCours")
    public ResponseEntity<Set<Cours>> getAllCours() {
        Set<Cours> Courss = iCoursService.getAllCours();
        return ResponseEntity.ok(Courss);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cours> updateCours(
            @PathVariable Long id,
            @RequestParam("nom") String nom,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "dates", required = false) List<String> dates,
            @RequestParam(value = "heures", required = false) List<String> heures) {
        try {
            Cours existingCours = iCoursService.getCoursById(id);

            if (nom != null && !nom.isEmpty()) {
                existingCours.setNom(nom);
            }

              if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "fitness/cours");
                    existingCours.setImage(imageUrl);
                }

            if (dates != null) {
                List<JourSemaine> jourSemaineList = dates.stream()
                        .map(JourSemaine::valueOf)
                        .collect(Collectors.toList());
                existingCours.setDates(jourSemaineList);
            }

            if (heures != null) {
                existingCours.setHeures(heures);
            }

            Cours updatedCours = iCoursService.updateCours(id, existingCours);

            return ResponseEntity.ok(updatedCours);
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
    public ResponseEntity<List<Cours>> getCoursByDates(@PathVariable JourSemaine jour) {
        List<Cours> cours = iCoursService.getCoursByDates(jour);
        return ResponseEntity.ok(cours);
    }
}
