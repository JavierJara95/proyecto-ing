package cl.duoc.smaa.controller;

import cl.duoc.smaa.model.DeclaracionSag;
import cl.duoc.smaa.service.DeclaracionSagService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sag")
@CrossOrigin(origins = "*")
public class DeclaracionSagController {
    private final DeclaracionSagService service;
    public DeclaracionSagController(DeclaracionSagService service) { this.service = service; }
    @PostMapping public ResponseEntity<DeclaracionSag> crear(@RequestBody DeclaracionSag sag) { return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(sag)); }
    @GetMapping public List<DeclaracionSag> listar() { return service.listar(); }
    @GetMapping("/declaracion/{idDeclaracion}") public List<DeclaracionSag> porDeclaracion(@PathVariable Long idDeclaracion) { return service.buscarPorDeclaracion(idDeclaracion); }
    @PutMapping("/{id}/aprobar") public DeclaracionSag aprobar(@PathVariable Long id) { return service.aprobar(id); }
    @PutMapping("/{id}/observar") public DeclaracionSag observar(@PathVariable Long id) { return service.observar(id); }
}
