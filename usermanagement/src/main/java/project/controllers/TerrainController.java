package project.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
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
import project.models.Terrain;
import project.service.FileStorageException;
import project.service.FileStorageService;
import project.service.ITerrainService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/terrain")
@RequiredArgsConstructor
public class TerrainController {

    private final ITerrainService iTerrainService;
    private final FileStorageService fileStorageService;

    @PostMapping()
    public ResponseEntity<?> addTerrain(@RequestParam("nom") String nom,
                                      @RequestParam("image") MultipartFile imageFile) {
        try {
            // Validation des paramètres
            if (nom == null || nom.isEmpty() || imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid input parameters.");
            }

            // Stocker le fichier d'image
            String fileName = fileStorageService.storeFile(imageFile);

            Terrain terrain = new Terrain();
            terrain.setNom(nom);
            terrain.setImage(fileName);



            Terrain savedTerrain = iTerrainService.addTerrain(terrain);

            return ResponseEntity.ok(savedTerrain);
        } catch (FileStorageException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error storing the file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request: " + e.getMessage());
        }
    }



    @GetMapping("{id}")
    public Terrain getTerrainById(@PathVariable Long id){
        return iTerrainService.getTerrainById(id);
    }

    @DeleteMapping("{id}")
    public void deleteTerrain(@PathVariable Long id) { iTerrainService.deleteTerrain(id);}

    @GetMapping("/allTerrain")
    public ResponseEntity<Set<Terrain>> getAllTerrain() {
        Set<Terrain> terrains = iTerrainService.getAllTerrains();
        return ResponseEntity.ok(terrains);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Terrain> updateTerrain(
            @PathVariable Long id,
            @RequestParam("nom") String nom,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            Terrain existingTerrain = iTerrainService.getTerrainById(id);

            if (nom != null && !nom.isEmpty()) {
                existingTerrain.setNom(nom);
            }

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
                String imagePath = fileName;
                Path path = Paths.get("images/");
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }
                Files.copy(imageFile.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                existingTerrain.setImage(imagePath);
            }



            Terrain updatedTerrain = iTerrainService.updateTerrain(id, existingTerrain);

            return ResponseEntity.ok(updatedTerrain);
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
}