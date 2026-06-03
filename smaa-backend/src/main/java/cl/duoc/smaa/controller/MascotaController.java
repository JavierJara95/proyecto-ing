package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.Mascota;
import cl.duoc.smaa.service.MascotaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {
    private final MascotaService service;
    public MascotaController(MascotaService service) { this.service = service; }
    @PostMapping public ResponseEntity<Mascota> crear(@Valid @RequestBody Mascota mascota) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(mascota)); }
    @GetMapping public List<Mascota> listar() { return service.listar(); }
    @GetMapping("/declaracion/{idDeclaracion}") public List<Mascota> porDeclaracion(@PathVariable Long idDeclaracion) { return service.buscarPorDeclaracion(idDeclaracion); }
}
